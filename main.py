from flask import Flask, render_template, request, url_for, redirect, flash, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String
from flask_login import UserMixin, login_user, LoginManager, login_required, current_user, logout_user
import os


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
    return db.get_or_404(User, user_id)

app.route("/")
def index():
    return render_template("landing page/index.html", logged_in = current_user.is_authenticated)

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get('login-email')
        password = request.form.get('login-password')
        result = db.session.execute(db.select(User).where(User.email == email))
        user = result.scalar()
        if not user:
            flash("That email does not exist, please try again.")
            return redirect(url_for('login'))
        elif not check_password_hash(user.password, password):
            flash('Password incorrect, please try again.')
            return redirect(url_for('login'))
        else:
            login_user(user)
            return redirect(url_for('dashboard'))
    # Passing True or False if the user is authenticated. 
    return render_template("login.html", logged_in=current_user.is_authenticated)

app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form.get("work-email")
        result = db.session.execute(db.select(User).where(User.email == email))
        user = result.scalars()

        #checking if the user already exists
        if user:
            flash("You already have an account","Login instead")
            return redirect(url_for("login"))

        first_name = request.form.get("first-name") 
        last_name = request.form.get("last-name")
        email = request.form.get("work-email")
        company_name = request.form.get("company-name")
        company_size = request.form.get("company-size")
        role = request.form.get("role")
        password = generate_password_hash(
            request.form.get('password'),
            method='pbkdf2:sha256',
            salt_length=8
        )
        confirm_password = generate_password_hash(
            request.form.get('confirm-password'),
            method='pbkdf2:sha256',
            salt_length=8
        )
        terms = request.form.get("terms")
        newsletter = request.form.get("newsletter")

        #checking if all fields are filled
        if not first_name or not last_name or not email or not company_name or not company_size or not role or not password or not confirm_password or not terms or not newsletter:
            return redirect(url_for("register"))

        if password != confirm_password:
            flash("Passwords do not match", "error")
        
        new_user = User(
            first_name = first_name,
            last_name = last_name,
            email = email,
            company_name = company_name,
            company_size = company_size,
            role = role,
            password = password
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("dashboard"))

    return render_template("landing page/register.html", logged_in = current_user.is_authenticated)

app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard/dashboard.html", logged_in =True) 

app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True, port = 8080)