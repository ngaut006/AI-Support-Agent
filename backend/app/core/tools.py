from typing import Dict, Any

def create_servicenow_ticket(description: str, urgency: str = "medium") -> Dict[str, Any]:
    """
    Mock tool to create a ServiceNow ticket.
    """
    return {
        "ticket_id": "INC123456",
        "status": "created",
        "description": description,
        "urgency": urgency
    }

def lookup_user_status(user_id: str) -> Dict[str, Any]:
    """
    Mock tool to look up user status.
    """
    return {
        "user_id": user_id,
        "status": "active",
        "last_login": "2023-10-27T09:00:00Z"
    }

AVAILABLE_TOOLS = {
    "create_servicenow_ticket": create_servicenow_ticket,
    "lookup_user_status": lookup_user_status
}
