import os
from flask import Flask, send_from_directory, request, jsonify, Response

app = Flask(__name__, static_folder='./build/static')

# Mock data, in reality you would have a database
# List of dictionaries is a great JSON format to return data
CATALOG = [
    {
        'id': 1,
        'title': 'The Reluctant Fundamentalist',
        'author': 'Mohsin Hamid',
    },
    {
        'id': 2,
        'title': 'Sea of Poppies',
        'author': 'Amitav Ghosh',
    },
    {
        'id': 3,
        'title': 'Debt',
        'author': 'David Graeber',
    },
]

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# A route to return all of the available entries in our catalog.
@app.route('/api/v1/books/all', methods=['GET'])
def api_all():
    return jsonify(CATALOG)

# A route to create or access a specific entry in our catalog based on request.
@app.route('/api/v1/books', methods=['GET', 'POST'])
def api_id():
    # User wants to create a new book in the catalog
    if request.method == 'POST':
        # Gets the JSON object from the body of request sent by client
        request_data = request.get_json()
        new_book = {
            'id': len(CATALOG),
            'title': request_data['title'],
            'author': request_data['author'],
        }
        CATALOG.append(new_book)
        return {'success': True} # Return success status if it worked
    else:
        book_id = request.args.get('book_id', '')
        if book_id == '':
            return Response("Error: No id field provided. Please specify an id.", status=400)

        # For real DB, you would replace with a filter clause in SQLAlchemy
        results = []
        for book in CATALOG:
            if book['id'] == int(book_id):
                results.append(book)

    return jsonify(results)

app.run(
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
