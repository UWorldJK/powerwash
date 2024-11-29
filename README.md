# Team 5: PowerWash: Automatic Exploratory Data Analysis (EDA)

**Contributors:** Tate Middleton, David Valarde, Jacob Kurry, Riley Sackett, Abiral Tuladhar

**Overview:**  
PowerWash is a streamlined tool designed to simplify the process of cleaning and analyzing datasets. By allowing users to upload a CSV through our intuitive front-end interface, PowerWash takes care of the heavy lifting in the background. Leveraging Python’s powerful Pandas library, the data is cleaned and prepped for further analysis.

Once the dataset is wrangled, users can visualize their data through a variety of plot types, where the use can select the variables in which they want to plot against eachother.

These visualizations are created using JavaScript's plotly library. Additionally, PowerWash offers insights into the dataset’s granularity (primary keys), helping users better understand the structure of their data. Finally, PowerWash also offers users classification of their data, using the K-Nearest Neighbors machine learning algorithm.

The tool also allows users to export and present their findings in the form of slideshows, making it easy to share and communicate insights with others.

**Our Vision:**
We aim at creating an all in one software that takes care of the laborious process of data wrangling and efficently returns the user not only a cleaned data set, but also the foundational information for EDA.

# Implementation Plan

Our front-end design will leverage Handlebars templating to create clean, organized, and easily navigable pages. This approach will allow us to maintain modularity and clarity across the user interface.

**Pages:**

Login Page: Allows users to securely log in.

Register Page: Facilitates new user registration.

Logout Page: Enables users to log out of their account.

Home Page: Provides a user interface for CSV file input.

![IMG_0068](https://github.com/user-attachments/assets/c801b93d-2f77-49bf-89fc-d5c9f91139e2)

Choice Page: Lets the user choose what they want to do with their clean data (granularity, graph, present, export, etc.)

![IMG_0069](https://github.com/user-attachments/assets/d7f44459-fbad-497b-ac90-38824285d82d)

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

**Front End Design**

Our front-end architecture will use a combination of HTML, Handlebars, and Google Charts to provide user-interface, a way to display variable data in a templated format, and connect our front-end to our back-end.

HTML will be used to layout the contents of the webpage
Handlebars will allow the website to displays variable data and user info into an empty template
Google Charts brings a variety of tools to display data in various charts/plots on the site

**Tech Stack**
Node, HTML, JS, Python, CSS, Express, Bootstrap, PostgressSQL, Flask


