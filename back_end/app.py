# importing the app factory
from DnD import create_app

# creating an instance called app from the defined function in DnD/__init__.py
app = create_app()


if __name__ == '__main__':
    app.run(debug=True)