from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import BadRequest  
import json
import os
STUDENTS_FILE = 'students.json'

def load_students():
    if not os.path.exists(STUDENTS_FILE):
        return []
    with open(STUDENTS_FILE, 'r') as f:
        return json.load(f)

def save_students(students):
    with open(STUDENTS_FILE, 'w') as f:
        json.dump(students, f, indent=2)

app = Flask(__name__)
CORS(app)

# Simulated in-memory "database"
students = []
next_student_id = 1

@app.route('/register', methods=['POST'])
def register():
    students = load_students()  # ✅ load existing users from the file

    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    email = data.get('email', '').strip()

    # Check for existing username
    if any(s['username'] == username for s in students):
        return jsonify({'success': False, 'message': 'Username already taken'}), 400

    # Assign next available ID
    next_id = max([s['id'] for s in students], default=0) + 1

    # Add new user
    student = {
        'id': next_id,
        'username': username,
        'password': password,
        'email': email,
        'enrolled_courses': []
    }

    students.append(student)
    save_students(students)  # ✅ now it actually gets saved to file!

    return jsonify({'success': True, 'message': 'Registration successful', 'student': student})

@app.route('/login', methods=['POST'])
def login():
    students = load_students()  # or use in-memory `students` if you're not using JSON

    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')

    # Check credentials
    for student in students:
        if student['username'] == username and student['password'] == password:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'student': {
                    'id': student['id'],
                    'username': student['username'],
                    'email': student['email']
                }
            })

    return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
@app.route('/courses', methods=['GET'])
def get_courses():
    try:
        with open('courses.json', 'r') as f:
            courses = json.load(f)
        return jsonify(courses)
    except Exception as e:
        print(f"Error in /courses: {e}")  # <-- log the error
        return jsonify({'success': False, 'message': str(e)}), 500

import random

@app.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        with open('testimonials.json', 'r') as f:
            all_testimonials = json.load(f)
        return jsonify(random.sample(all_testimonials, 2))
    except Exception as e:
        return jsonify([])  # return an empty list on failure
@app.route('/student_courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    students = load_students()
    student = next((s for s in students if s['id'] == student_id), None)

    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404

    return jsonify(student['enrolled_courses'])
@app.route('/enroll/<int:student_id>', methods=['POST'])
def enroll_course(student_id):
    students = load_students()
    course = request.get_json()

    student = next((s for s in students if s['id'] == student_id), None)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found'}), 404

    # Prevent duplicate enrollments
    if any(c['id'] == course['id'] for c in student['enrolled_courses']):
        return jsonify({'success': False, 'message': 'Already enrolled in this course'}), 400

    student['enrolled_courses'].append(course)
    save_students(students)

    return jsonify({'success': True, 'message': 'Course enrolled successfully'})
@app.route('/drop/<int:student_id>', methods=['POST'])
def drop_course(student_id):
    try:
        students = load_students()
        try:
            course = request.get_json(force=True)  # ✅ force body parsing
        except BadRequest as e:
            print(f"DROP ERROR: Could not parse JSON: {e}")
            return jsonify({'success': False, 'message': 'Invalid JSON body'}), 400

        print(f"Dropping course for student {student_id}: {course}")

        student = next((s for s in students if s['id'] == student_id), None)
        if not student:
            return jsonify({'success': False, 'message': 'Student not found'}), 404

        before = len(student['enrolled_courses'])
        student['enrolled_courses'] = [
            c for c in student['enrolled_courses'] if c['id'] != course['id']
        ]
        after = len(student['enrolled_courses'])

        if before == after:
            return jsonify({'success': False, 'message': 'Course not found in enrollment'}), 400

        save_students(students)
        return jsonify({'success': True, 'message': 'Course dropped successfully'})
    except Exception as e:
        print(f"DROP ERROR: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500




# Basic test route
@app.route('/')
def home():
    return 'LMS Flask Backend is running!'

if __name__ == '__main__':
    app.run(debug=True)
