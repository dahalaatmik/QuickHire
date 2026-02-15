import json
import os
import re


JD_PARSE_PROMPT = """You are an expert HR analyst. Parse this job description and extract structured data.

Return ONLY a valid JSON object (no markdown, no code fences) with this structure:
{
  "title": "extracted job title",
  "field_category": "e.g., Software Engineering, Marketing, Finance",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "experience": {
    "min_years": 3,
    "max_years": 5,
    "type": "e.g., backend development"
  },
  "education": {
    "degree": "Bachelor's/Master's/PhD",
    "field": "Computer Science, etc.",
    "required": true
  },
  "key_requirements": ["requirement1", "requirement2"]
}

Job Description:
"""

RESUME_ANALYSIS_PROMPT = """You are an expert recruiter. Analyze this resume against the job requirements.

JOB REQUIREMENTS:
{job_context}

RESUME TEXT:
{resume_text}

Return ONLY a valid JSON object (no markdown, no code fences) with this structure:
{{
  "candidate_info": {{
    "name": "extracted full name",
    "email": "extracted email or null",
    "phone": "extracted phone or null"
  }},
  "extracted_data": {{
    "skills": ["skill1", "skill2"],
    "education": [{{"degree": "", "field": "", "institution": "", "year": ""}}],
    "experience_summary": "brief summary of work experience",
    "years_of_experience": 5
  }},
  "scores": {{
    "overall": 85,
    "skills_match": 90,
    "experience_match": 80,
    "education_match": 85,
    "field_relevance": 85
  }},
  "tier": "Strong",
  "ai_summary": "2-3 sentence summary of candidate fit for this specific role",
  "scoring_rationale": "brief explanation of how scores were determined"
}}

IMPORTANT: tier must be "Strong" (75-100), "Medium" (50-74), or "Weak" (0-49) based on overall score.
Scores must be integers between 0 and 100.
"""


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code fences."""
    text = text.strip()
    # Remove markdown code fences
    match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if match:
        text = match.group(1).strip()
    # Try to find JSON object
    start = text.find('{')
    if start != -1:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    text = text[start:i + 1]
                    break
    return json.loads(text)


class GeminiProvider:
    def __init__(self, api_key: str):
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def parse_job_description(self, jd_text: str) -> dict:
        prompt = JD_PARSE_PROMPT + jd_text
        response = self.model.generate_content(prompt)
        return _extract_json(response.text)

    def analyze_resume(self, resume_text: str, job_context: dict) -> dict:
        prompt = RESUME_ANALYSIS_PROMPT.format(
            job_context=json.dumps(job_context, indent=2),
            resume_text=resume_text
        )
        response = self.model.generate_content(prompt)
        return _extract_json(response.text)


def get_ai_provider():
    provider = os.getenv('AI_PROVIDER', 'gemini')
    if provider == 'gemini':
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in environment")
        return GeminiProvider(api_key)
    else:
        raise ValueError(f"Unknown AI provider: {provider}")
