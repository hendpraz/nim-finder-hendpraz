import logging
from datetime import datetime
from difflib import SequenceMatcher
from typing import List, Tuple, Dict, Any
import json

# Configure logging
logging.basicConfig(
    filename='api_calls.log',
    level=logging.INFO,
    format='%(message)s'
)

def log_search(query: str, page: int, results_count: int) -> None:
    """Log search query details in JSON format."""
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "query": query,
        "page": page,
        "results_count": results_count,
    }
    logging.info(json.dumps(log_entry))

def normalize_string(s: str) -> str:
    """Normalize string for comparison by lowercasing and removing extra spaces."""
    return ' '.join(s.lower().split())

def get_similarity_ratio(str1: str, str2: str) -> float:
    """Calculate similarity ratio between two strings."""
    return SequenceMatcher(None, normalize_string(str1), normalize_string(str2)).ratio()

def search_students(
    query: str, 
    students: List[Tuple[str, str]], 
    page: int = 0,
    similarity_threshold: float = 0.4
) -> Dict[str, Any]:
    """
    Search for students with names similar to the query.
    
    Args:
        query: Search query string
        students: List of tuples containing (id, name)
        page: Page number for pagination
        similarity_threshold: Minimum similarity ratio to include in results
        
    Returns:
        Dictionary containing search results and metadata
    """
    query = normalize_string(query)
    results = []
    
    for student_id, name in students:
        # Calculate similarity for full name
        full_name_similarity = get_similarity_ratio(query, name)
        
        # Calculate similarity for partial matches (first/last names)
        name_parts = normalize_string(name).split()
        partial_similarities = [
            get_similarity_ratio(query, part)
            for part in name_parts
        ]
        
        # Use the highest similarity score found
        best_similarity = max([full_name_similarity] + partial_similarities)
        
        if best_similarity >= similarity_threshold:
            results.append((student_id, name, best_similarity))
    
    # Sort by similarity score in descending order
    results.sort(key=lambda x: x[2], reverse=True)
    
    # Log the search query
    log_search(query, page, len(results))
    
    return {
        "results": results,
        "total": len(results),
        "page": page,
        "query": query
    }

# Example usage
if __name__ == "__main__":
    # Sample data
    students_data = [
        ("16016001,10216005", "Daryanda Dwiammardi Djamal"),
        ("16016002,10216045", "Evy Isnaeni")
    ]
    
    # Example searches
    test_queries = [
        "Daryanda Djamal",  # Partial match
        "Evy",              # Exact partial match
        "Evi Isnaeni",      # Slight misspelling
    ]
    
    for query in test_queries:
        print(f"\nSearching for: {query}")
        result = search_students(query, students_data)
        print(f"Found {result['total']} results on page {result['page']}")
        for student_id, name, score in result["results"]:
            print(f"- {name} (ID: {student_id}) - Similarity: {score:.2f}")