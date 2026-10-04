import json
import logging
import re
import requests
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.schemas.schemas import GemmaAnalysisOutput

logger = logging.getLogger("contextlens.gemma_service")

SYSTEM_PROMPT = """
You are Gemma 4, an expert AI document analyst for ContextLens.
Your goal is to perform strict, structured document understanding on the provided text.

CRITICAL INSTRUCTIONS (ANTI-HALLUCINATION):
1. Extract true facts, requirements, action items, deadlines, deliverables, risks/ambiguities, and open questions.
2. DO NOT invent deadlines, requirements, names, dates, or facts that do not appear in the source document.
3. For EVERY extracted item, provide a `source_reference` object containing:
   - `page`: the integer page number where this information appears
   - `text`: the exact or near-exact verbatim sentence/snippet from the document supporting this claim.
4. If something is ambiguous or missing, add it to `questions` or `risks`.
5. Return strictly valid JSON adhering to the specified output schema.

OUTPUT SCHEMA:
{
  "summary": "Executive summary of the document (2-4 sentences).",
  "requirements": [
    {
      "title": "Short title of requirement",
      "description": "Detailed requirement description",
      "source_reference": {"page": 1, "text": "Exact text from document"}
    }
  ],
  "actions": [
    {
      "title": "Action title",
      "description": "Details of action item",
      "priority": "high" | "medium" | "low",
      "deadline": "YYYY-MM-DD or explicit date text if present, else null",
      "source_reference": {"page": 1, "text": "Exact text from document"}
    }
  ],
  "deadlines": [
    {
      "title": "Deadline description",
      "date_text": "May 15, 2026",
      "page": 1
    }
  ],
  "deliverables": [
    {
      "name": "Deliverable name",
      "description": "Deliverable summary",
      "page": 1
    }
  ],
  "risks": [
    {
      "description": "Description of potential risk or ambiguity",
      "severity": "high" | "medium" | "low",
      "source_reference": {"page": 1, "text": "Exact text from document"}
    }
  ],
  "questions": [
    {
      "question": "Unclear point or missing information requiring clarification",
      "source_reference": {"page": 1, "text": "Exact text from document"}
    }
  ]
}
"""

class GemmaService:
    @staticmethod
    def analyze_document_content(pages: List[Dict[str, Any]], filename: str) -> Dict[str, Any]:
        """
        Analyzes document pages using Gemma/Gemini/Groq API with fallback to structured extraction.
        """
        formatted_document_text = ""
        for page_data in pages:
            p_num = page_data.get("page", 1)
            p_text = page_data.get("text", "")
            formatted_document_text += f"\n--- PAGE {p_num} ---\n{p_text}\n"

        # 1. Try Groq API if GROQ_API_KEY is present
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
            logger.info("Attempting analysis using Groq API (Gemma model)...")
            try:
                res = GemmaService._call_groq_api(formatted_document_text)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Groq API call failed: {str(e)}. Proceeding to next provider...")

        # 2. Try Gemini API via google-genai if GEMINI_API_KEY is present
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
            logger.info("Attempting analysis using Google GenAI API...")
            try:
                res = GemmaService._call_google_genai_api(formatted_document_text)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Google GenAI API call failed: {str(e)}. Proceeding to fallback engine...")

        # 3. Fallback Document Extractor Engine
        logger.info("Executing rule-based document analysis engine fallback...")
        return GemmaService._fallback_document_analysis(pages, filename)

    @staticmethod
    def _call_groq_api(document_text: str) -> Optional[Dict[str, Any]]:
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
            "Content-Type": "application/json"
        }
        prompt = f"Document Filename: Document\n\nDocument Content:\n{document_text}\n\nProvide the structured JSON analysis."
        payload = {
            "model": settings.GEMMA_MODEL or "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=45
        )
        
        if response.status_code == 200:
            data = response.json()
            raw_json = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_json)
            validated = GemmaAnalysisOutput.model_validate(parsed)
            return validated.model_dump()
        else:
            logger.warning(f"Groq API returned status {response.status_code}: {response.text}")
            return None

    @staticmethod
    def _call_google_genai_api(document_text: str) -> Optional[Dict[str, Any]]:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY.strip())
        prompt = f"{SYSTEM_PROMPT}\n\nDocument Content:\n{document_text}\n\nReturn JSON response."

        model_name = "gemini-2.5-flash"
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        if response and response.text:
            parsed = json.loads(response.text)
            validated = GemmaAnalysisOutput.model_validate(parsed)
            return validated.model_dump()
        return None

    @staticmethod
    def _fallback_document_analysis(pages: List[Dict[str, Any]], filename: str) -> Dict[str, Any]:
        all_sentences = []
        for p in pages:
            page_num = p.get("page", 1)
            text = p.get("text", "")
            lines = [line.strip() for line in text.split("\n") if line.strip()]
            for line in lines:
                all_sentences.append({"page": page_num, "text": line})

        requirements = []
        actions = []
        deadlines = []
        deliverables = []
        risks = []
        questions = []

        req_keywords = ["must", "shall", "required", "requirement", "need to", "should", "specify", "ensure"]
        action_keywords = ["submit", "build", "create", "implement", "deploy", "setup", "complete", "prepare", "test", "write", "develop"]
        deadline_keywords = ["deadline", "due", "by", "until", "date", "schedule", "timeline", "before"]
        risk_keywords = ["risk", "ambiguity", "unclear", "warning", "note", "caution", "depend", "missing", "challenge", "issue"]
        question_keywords = ["?", "tbd", "todo", "unknown", "clarify", "confirm", "whether"]

        for item in all_sentences:
            s_text = item["text"]
            p_num = item["page"]
            lower_text = s_text.lower()

            if any(k in lower_text for k in deadline_keywords) and len(s_text) < 150:
                deadlines.append({
                    "title": s_text[:80],
                    "date_text": s_text,
                    "page": p_num
                })

            if any(k in lower_text for k in req_keywords):
                requirements.append({
                    "title": s_text[:60] + ("..." if len(s_text) > 60 else ""),
                    "description": s_text,
                    "source_reference": {"page": p_num, "text": s_text}
                })

            if any(k in lower_text for k in action_keywords) or s_text.strip().startswith(("-", "*", "1.", "2.", "3.")):
                priority = "high" if any(h in lower_text for h in ["critical", "must", "urgent", "important"]) else "medium"
                actions.append({
                    "title": re.sub(r"^[\-\*\d\.\s]+", "", s_text)[:70],
                    "description": s_text,
                    "priority": priority,
                    "deadline": None,
                    "source_reference": {"page": p_num, "text": s_text}
                })

            if any(k in lower_text for k in risk_keywords):
                severity = "high" if "critical" in lower_text or "high" in lower_text else "medium"
                risks.append({
                    "description": s_text,
                    "severity": severity,
                    "source_reference": {"page": p_num, "text": s_text}
                })

            if "?" in s_text or any(k in lower_text for k in question_keywords):
                questions.append({
                    "question": s_text,
                    "source_reference": {"page": p_num, "text": s_text}
                })

        if not requirements and all_sentences:
            first_sentence = all_sentences[0]
            requirements.append({
                "title": f"Document Specification ({filename})",
                "description": first_sentence["text"],
                "source_reference": {"page": first_sentence["page"], "text": first_sentence["text"]}
            })

        if not actions and all_sentences:
            first_sentence = all_sentences[0]
            actions.append({
                "title": f"Review document '{filename}'",
                "description": f"Perform full review of {filename}",
                "priority": "high",
                "deadline": None,
                "source_reference": {"page": first_sentence["page"], "text": first_sentence["text"]}
            })

        summary_text = f"ContextLens analysis for '{filename}'. Analyzed {len(pages)} page(s) containing {len(all_sentences)} extracted lines. "
        if requirements:
            summary_text += f"Identified {len(requirements)} requirement(s) and {len(actions)} actionable task(s). "
        if risks:
            summary_text += f"Flagged {len(risks)} potential risk(s) or ambiguities for review."

        return {
            "summary": summary_text,
            "requirements": requirements[:15],
            "actions": actions[:15],
            "deadlines": deadlines[:8],
            "deliverables": deliverables[:8],
            "risks": risks[:10],
            "questions": questions[:10]
        }
