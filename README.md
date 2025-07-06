# crumb Social Media 

This is a social media application built with **React Native** for a seamless cross-platform mobile experience. It leverages **Supabase** for its backend services, including database management and robust authentication APIs.

## Features (Planned/Implemented)

* User authentication (Sign up, Log in)
* User profiles
* Posting and viewing content
* Interacting with posts (Liking, commenting)
* (A super cool feature coming soon, I can tell you on discord or LinkedIn)

## Technologies Used

* **React Native**: For building native mobile applications using JavaScript and React.
* **Supabase**: For database, authentication, and other backend services.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/MenaceHecker/crumb]
    cd [crumb]
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```

3.  **Run the app:**
    ```bash
    npx react-native run-android # For Android
    npx react-native run-ios   # For iOS (macOS required)

    ```
4.  **Run the app on Android/iPhone in case QR code via npm start does not work:**
    ```bash
    npx expo start --tunnel #This runs the dev server with your local IPv4 address (Trying to fix this issue)
    
    ``` 
5.  **When pushing updates, push it to both expo server as well as git else the app crashes**
    ```bash
    eas update --branch main --message "The_Message" #This runs the dev server with your local IPv4 address (Trying to fix this)

---

Feel free to explore and contribute! There are some issues caused by deprecated libraries that need fixing. Maybe some of them need an update. 