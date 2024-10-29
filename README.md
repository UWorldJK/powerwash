# Team 5: PowerWash: Automatic Exploratory Data Analysis (EDA)

**Contributors:** Tate Middleton, David Valarde, Jacob Kurry, Riley Sackett, Abiral Tuladhur

**Overview:**  
PowerWash is a streamlined tool designed to simplify the process of cleaning and analyzing datasets. By allowing users to upload a CSV through our intuitive front-end interface, PowerWash takes care of the heavy lifting in the background. Leveraging Python’s powerful Pandas library, the data is cleaned and prepped for further analysis.

Once the dataset is wrangled, users can visualize their data through a variety of plot types, including:
- Box plots
- Histograms
- Bar plots
- Scatter plots

These visualizations are created using Python’s Seaborn and Matplotlib libraries. Additionally, PowerWash offers insights into the dataset’s granularity (primary keys), helping users better understand the structure of their data. 

The tool also allows users to export and present their findings in the form of slideshows, making it easy to share and communicate insights with others.

**Our Vision:**
We aim at creating an all in one software that takes care of the laborious process of data wrangling and efficently returns the user not only a cleaned data set, but also the foundational information for EDA.

# Implementation Plan

Our front-end design will leverage Handlebars templating to create clean, organized, and easily navigable pages. This approach will allow us to maintain modularity and clarity across the user interface.

**Pages:**

Home Page: Provides a user interface for CSV file input.

Login Page: Allows users to securely log in.

Register Page: Facilitates new user registration.

Logout Page: Enables users to log out of their account.

Presentation Page: Displays processed data visually.

Information Page: Offers detailed explanations and data insights.

**For navigation and visual styling:**

**Bootstrap** will enhance navigation and layout consistency.
**CSS** will provide custom styling to ensure a cohesive look and feel.
We will integrate various APIs to dynamically present data and offer a more interactive experience.

**Back End Design:**

Our back-end architecture will use a combination of JavaScript (Node.js) and Python’s Flask to deliver the necessary functionality. Flask and Node.js will operate on separate ports, enabling seamless handling of different aspects of the application:

Flask will manage data-related tasks, including data cleaning and processing, as well as any interactions with data-intensive operations.
Node.js will handle user authentication, page routing, and other front-end interactions, providing a responsive interface.
This dual-setup allows us to leverage the strengths of both frameworks, creating a robust, efficient, and scalable application.

**TREE**
|--init_data
    |--create.sql
|--node_modules
    |--express/
    |--express-handlebars/
    |--handlebars/
    |--pg-promise/
    |--<...other packages>
|--views
    |--layouts
        |--main.hbs
    |--pages
        |--discover.hbs
        |--login.hbs
        |--logout.hbs
        |--register.hbs
    |--partials
        |--footer.hbs
        |--head.hbs
        |--message.hbs
        |--nav.hbs
        |--title.hbs
|--.env
|--.gitignore
|--docker-compose.yaml
|--main.py
|--package.json
|--index.js


**Tech Stack**
Node, HTML, JS, Python, GPT API, CSS, Express, Bootstrap, PostgressSQL, Flask


