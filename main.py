from flask import Flask, render_template, request, url_for, redirect, flash, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY") 

#create database
class Base(DeclarativeBase):
    pass

#initialize database
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
db = SQLAlchemy(model_class=Base)
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

#database structure
class User(UserMixin, db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    first_name : Mapped[str] = mapped_column(String, nullable = False)
    last_name : Mapped[str] = mapped_column(String, nullable = False)
    work_email : Mapped[str] = mapped_column(String, nullable = False, unique = True)
    company_name : Mapped[str] = mapped_column(String, nullable = False, unique = True)
    company_size : Mapped[str] = mapped_column(String, nullable = False)
    role : Mapped[str] = mapped_column(String, nullable = False)
    password : Mapped[str] = mapped_column(String, nullable = False)
    
with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

@app.route("/")
def index():
    return render_template("landing page/index.html", logged_in = current_user.is_authenticated)

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get('login-email')
        password = request.form.get('login-password')
        
        # 1. Query the database using the correct column name
        result = db.session.execute(db.select(User).where(User.work_email == email))
        user = result.scalar()
        
        # 2. Check if user exists
        if not user:
            flash("That email does not exist, please try again.")
            return redirect(url_for('login'))
        
        # 3. Check password hash
        if not check_password_hash(user.password, password):
            flash('Password incorrect, please try again.')
            return redirect(url_for('login'))
        
        # 4. Successful Login
        login_user(user)
        return redirect(url_for('dashboard'))

    # 5. Fix the template path (Remove space or ensure it matches your folder)
    return render_template("landing page/auth.html", logged_in=current_user.is_authenticated)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # 1. Collect raw data
        email = request.form.get("work-email")
        raw_password = request.form.get('password')
        raw_confirm = request.form.get('confirm-password')
        
        # 2. Check if user already exists (using the correct column: work_email)
        existing_user = db.session.execute(
            db.select(User).where(User.work_email == email)
        ).scalar()

        if existing_user:
            flash("You already have an account. Please login instead.")
            return redirect(url_for("login"))

        # 3. Validation: Check if passwords match BEFORE hashing
        if raw_password != raw_confirm:
            flash("Passwords do not match. Please try again.")
            return redirect(url_for("register"))

        # 4. Collect other fields
        first_name = request.form.get("first-name") 
        last_name = request.form.get("last-name")
        company_name = request.form.get("company-name")
        company_size = request.form.get("company-size")
        role = request.form.get("role")
        terms = request.form.get("terms")

        # Basic "Required" check
        if not all([first_name, last_name, email, raw_password, terms]):
            flash("Please fill out all required fields and accept the terms.")
            return redirect(url_for("register"))

        # 5. Hash the password only once for storage
        hashed_password = generate_password_hash(
            raw_password,
            method='pbkdf2:sha256',
            salt_length=8
        )

        # 6. Create and save the new user
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            work_email=email, # Match the column name in your User class
            company_name=company_name,
            company_size=company_size,
            role=role,
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # 7. Log them in and go to dashboard
        login_user(new_user)
        return redirect(url_for("dashboard"))

    # Corrected the folder path (using underscore to match your index route)
    return render_template("landing page/register.html", logged_in=current_user.is_authenticated)

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard/dashboard.html", logged_in =True) 

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True, port = 8080)