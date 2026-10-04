import os
import uuid
import pdfplumber
from PIL import Image
from typing import List, Dict, Any, Tuple
from app.core.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt", ".xlsx", ".xls"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
}

class DocumentProcessingError(Exception):
    pass

class DocumentService:
    @staticmethod
    def validate_file(filename: str, file_size: int, content_type: str = None) -> str:
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise DocumentProcessingError(
                f"Unsupported file type '{ext}'. Supported formats: PDF, PNG, JPG, JPEG, TXT, XLSX, XLS"
            )
        
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if file_size > max_bytes:
            raise DocumentProcessingError(
                f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB"
            )
        
        return ext

    @staticmethod
    def save_uploaded_file(file_bytes: bytes, original_filename: str) -> Tuple[str, str, int]:
        ext = os.path.splitext(original_filename)[1].lower()
        safe_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
        
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
        return safe_filename, file_path, len(file_bytes)

    @staticmethod
    def extract_text_pages(file_path: str, file_type: str) -> List[Dict[str, Any]]:
        """
        Extracts structured text from document by page/section.
        Returns a list of dicts: [{"page": 1, "text": "..."}, ...]
        """
        ext = os.path.splitext(file_path)[1].lower()
        pages = []

        if ext == ".pdf":
            try:
                with pdfplumber.open(file_path) as pdf:
                    for i, page in enumerate(pdf.pages):
                        page_text = page.extract_text() or ""
                        page_text = page_text.strip()
                        if page_text:
                            pages.append({
                                "page": i + 1,
                                "text": page_text
                            })
            except Exception as e:
                # Fallback to PyPDF2 if pdfplumber fails
                try:
                    import PyPDF2
                    with open(file_path, "rb") as f:
                        reader = PyPDF2.PdfReader(f)
                        for i, page in enumerate(reader.pages):
                            t = page.extract_text() or ""
                            if t.strip():
                                pages.append({
                                    "page": i + 1,
                                    "text": t.strip()
                                })
                except Exception as py_err:
                    raise DocumentProcessingError(f"Failed to extract PDF content: {str(e)}")

        elif ext in [".png", ".jpg", ".jpeg"]:
            try:
                img = Image.open(file_path)
                pages.append({
                    "page": 1,
                    "text": f"[Image Document: {os.path.basename(file_path)}, Dimensions: {img.width}x{img.height}, Format: {img.format}]"
                })
            except Exception as e:
                raise DocumentProcessingError(f"Failed to process image: {str(e)}")

        elif ext == ".txt":
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                chunk_size = 1500
                chunks = [content[i:i + chunk_size] for i in range(0, len(content), chunk_size)]
                for i, chunk in enumerate(chunks):
                    if chunk.strip():
                        pages.append({
                            "page": i + 1,
                            "text": chunk.strip()
                        })
            except Exception as e:
                raise DocumentProcessingError(f"Failed to read text file: {str(e)}")

        elif ext in [".xlsx", ".xls"]:
            try:
                import pandas as pd
                # Read all sheets in Excel file
                excel_data = pd.read_excel(file_path, sheet_name=None)
                
                sheet_idx = 1
                for sheet_name, df in excel_data.items():
                    if df.empty:
                        continue
                    
                    # Convert dataframe to readable string representation
                    lines = [f"=== SHEET: {sheet_name} ==="]
                    # Add headers
                    headers = " | ".join([str(col) for col in df.columns])
                    lines.append(f"Headers: {headers}")
                    
                    # Add rows
                    for idx, row in df.iterrows():
                        row_vals = " | ".join([str(val) for val in row.values if pd.notna(val)])
                        if row_vals.strip():
                            lines.append(f"Row {idx + 1}: {row_vals}")
                    
                    sheet_text = "\n".join(lines)
                    pages.append({
                        "page": sheet_idx,
                        "text": sheet_text
                    })
                    sheet_idx += 1
            except Exception as e:
                raise DocumentProcessingError(f"Failed to process Excel file: {str(e)}")

        if not pages:
            pages.append({
                "page": 1,
                "text": "No text content could be extracted from this document."
            })

        return pages
