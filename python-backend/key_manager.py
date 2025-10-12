"""
Key Manager - Управление ключами доступа
"""

import json
import os
import secrets
import string

KEYS_FILE = os.path.join(os.getcwd(), "access_keys.json")

def generate_key():
    """Generate a random access key (only uppercase letters)"""
    chars = string.ascii_uppercase
    return ''.join(secrets.choice(chars) for _ in range(16))

def load_keys():
    """Load all keys from file"""
    if not os.path.exists(KEYS_FILE):
        # Create file with initial structure
        initial_data = {"active": [], "used": []}
        with open(KEYS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        return initial_data
    
    try:
        with open(KEYS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading keys: {e}")
        return {"active": [], "used": []}

def save_keys(keys_data):
    """Save keys to file"""
    with open(KEYS_FILE, 'w') as f:
        json.dump(keys_data, f, indent=2)

def create_keys(count=1):
    """Create new access keys"""
    keys_data = load_keys()
    new_keys = []
    
    for _ in range(count):
        key = generate_key()
        while key in keys_data["active"] or key in keys_data["used"]:
            key = generate_key()
        
        keys_data["active"].append(key)
        new_keys.append(key)
    
    save_keys(keys_data)
    return new_keys

def validate_key(key):
    """Validate and activate a key"""
    keys_data = load_keys()
    
    if key in keys_data["used"]:
        return {"valid": False, "message": "Ключ уже был использован"}
    
    if key in keys_data["active"]:
        # Move key from active to used
        keys_data["active"].remove(key)
        keys_data["used"].append(key)
        save_keys(keys_data)
        return {"valid": True, "message": "Ключ активирован успешно"}
    
    return {"valid": False, "message": "Недействительный ключ"}

def list_keys():
    """List all keys"""
    return load_keys()

if __name__ == "__main__":
    print("=== Key Manager ===")
    print("1. Generate new keys")
    print("2. List all keys")
    print("3. Validate key")
    
    choice = input("\nВыберите действие: ")
    
    if choice == "1":
        count = int(input("Сколько ключей создать? "))
        keys = create_keys(count)
        print(f"\nСозданы новые ключи:")
        for key in keys:
            print(f"  {key}")
    
    elif choice == "2":
        keys_data = list_keys()
        print(f"\nАктивные ключи ({len(keys_data['active'])}):")
        for key in keys_data["active"]:
            print(f"  {key}")
        print(f"\nИспользованные ключи ({len(keys_data['used'])}):")
        for key in keys_data["used"]:
            print(f"  {key}")
    
    elif choice == "3":
        key = input("Введите ключ: ")
        result = validate_key(key)
        print(f"\n{result['message']}")
