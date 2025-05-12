class LiveSupportChat {
    // Creating new instance of the class

    constructor(options) {

        // Default Options
        let defaults = {
            auto_login: true,
            php_directory_url: '',
            status: 'Idle',
            update_interval: 5000,
            current_chat_widget_tab: 1,
            conversation_id: null,
            notifications: true,
            files: {
                "authenticate": "authenticate.php",
                "conversation": "conversation.php",
                "conversations": "conversations.php",
                "find_conversation": "find_conversations.php",
                "post_message": "post_message.php",
                "notifications": "notifications.php",
                "logout": "logout.php"
            }
        };

        // Assign New options
        this.options = Object.assign(defaults, options);

        // Display Chat Icon Template
        document.body.insertAdjacentHTML('afterbegin', `<a href="#" class="open-chat-widget"><i class="fa-solid fa-comment-dots fa-lg"></i></a>`);

        // Display Widget Template
        document.body.insertAdjacentHTML('afterbegin', `<div class="chat-widget">
    <div class="chat-widget-header"><a href="#" class="previous-chat-tab-btn">&lsaquo;</a><a
            style="color: green; padding-left: 15px; font-size: 15px; font-family: serif; text-decoration: none;">An Operator Will Assist You Soon!</a><a href="#"
            class="close-chat-widget-btn">&times;</a></div>
    <div class="chat-widget-content">
        <div class="chat-widget-tabs">
            <div class="chat-widget-tab chat-widget-login-tab">
                <form action="${this.options.files['authenticate']}" method="POST"><input type="text" name="name"
                        placeholder="Your Name"><input type="email" name="email" placeholder="Your Email" required>
                    <div class="msg"></div><button type="submit">Submit</button>
                </form>
            </div>
            <div class="chat-widget-tab chat-widget-conversations-tab"></div>
            <div class="chat-widget-tab chat-widget-conversation-tab"></div>
        </div>
    </div>
</div>`);

        // Declaring Class Variables
        this.openWidgetBtn = document.querySelector(".open-chat-widget");
        this.container = document.querySelector(".chat-widget");

        // Authenticate User
        if (this.autoLogin && document.cookie.match(/^(.*;)?\s*chat_secret\s*=\s*[^;]+(.*)?$/)) {

            // Ajax Request To Retrieve The Conversation
            this.fetchConversations(data => {

                // No Errors
                if (data != "error") {
                    this.status = "Idle";
                    this.container.querySelector(".chat-widget-conversations-tab").innerHTML = data;

                    // Execute The Conversation
                    this._eventHandlers();

                    // Transition to Conversation Tab
                    this.selectChatWidgetTab(2);
                }
            });
        }

        // Executing Event Handlers
        this._eventHandlers();

        // Update
        setInterval(() => this.update(), this.options.update_interval);
    }

    // Open Chat Widget
    openChatWidget() {
        this.container.style.display = "flex";
        this.container.getBoundingClientRect();
        this.container.classList.add('open');
    }

    // Close Chat Widget
    closeChatWidget() {
        this.container.classList.remove("open");
        this.status = "Idle";
    }

    // Selecting Chat Tab
    selectChatWidgetTab(value) {
        this.currentChatWidgetTab = value;
        this.container.querySelectorAll(".chat-widget-tab").forEach(element => element.style.transform = `translateX(-${(value - 1) * 100}%)`);

        // Hiding Previous Tab Button
        this.container.querySelector(".previous-chat-tab-btn").style.display = value > 1 ? "block" : "none";

        // Updating Conversation
        if (value == 1 || value == 2) {
            this.containerId = null;
        }

        // Removing Cookie
        if (value == 1) {
            this.logOutUser();
        }
    }

    // GET Method
    get phpDirectoryUrl() {
        return this.options.php_directory_url;
    }

    set phpDirectoryUrl(value) {
        this.options.php_directory_url = value;
    }

    get currentChatWidgetTab() {
        return this.options.current_chat_widget_tab;
    }

    set currentChatWidgetTab(value) {
        this.options.current_chat_widget_tab = value;
    }

    get conversationId() {
        return this.options.conversation_id;
    }

    set conversationId(value) {
        this.options.conversation_id = value;
    }

    get files() {
        return this.options.files;
    }

    set files(value) {
        this.options.files = value;
    }

    get container() {
        return this.options.container;
    }

    set container(value) {
        this.options.container = value;
    }

    get status() {
        return this.options.status;
    }

    set status(value) {
        this.options.status = value;
    }

    get notifications() {
        return this.options.notifications;
    }

    set notifications(value) {
        this.options.notifications = value;
    }

    get autoLogin() {
        return this.options.auto_login;
    }

    set autoLogin(value) {
        this.options.auto_login = value;
    }

    // ***** Event Handlers *****

    _eventHandlers() {

        // Opening Chat Widget
        this.openWidgetBtn.onclick = event => {
            event.preventDefault();
            this.openChatWidget();
        }

        // Closing Chat Widget
        if (this.container.querySelector(".close-chat-widget-btn")) {
            this.container.querySelector(".close-chat-widget-btn").onclick = event => {
                event.preventDefault();
                this.closeChatWidget();
            }
        }

        // Previous Tab Button
        if (this.container.querySelector(".previous-chat-tab-btn")) {
            this.container.querySelector(".previous-chat-tab-btn").onclick = event => {
                event.preventDefault();
                this.selectChatWidgetTab(this.currentChatWidgetTab - 1);
            }
        }

        // New Chat Button
        if (this.container.querySelector(".chat-widget-new-conversation")) {
            this.container.querySelector(".chat-widget-new-conversation").onclick = event => {
                event.preventDefault();

                // Updating Status
                this.status = "Waiting";

                // Notifying The User
                this.container.querySelector(".chat-widget-conversations-tab").innerHTML = `<div class="chat-widget-messages"><div class="chat-widget-message">Please Wait....</div></div>`;

                // Transition
                this.selectChatWidgetTab(3);
            }
        }

        // Iteration of Conversations

        if (this.container.querySelectorAll(".chat-widget-user")) {
            this.container.querySelectorAll(".chat-widget-user").forEach(element => {
                element.onclick = event => {
                    event.preventDefault();

                    // Getting Conversations
                    this.getConversation(element.dataset.id);
                }
            });
        }

        // Login Form
        if (this.container.querySelector(".chat-widget-login-tab form")) {
            this.container.querySelector(".chat-widget-login-tab form").onsubmit = event => {
                event.preventDefault();

                // Authenticating User
                this.authenticateUser(this.container.querySelector(".chat-widget-login-tab form"), data => {
                    if (data.includes("MSG_LOGIN_REQUIRED")) {
                        this.container.querySelector(".chat-widget-login-tab .msg").insertAdjacentHTML('beforebegin', `<input type="password" name="password" placeholder="Your Password" required`);
                    } else if (data.includes("MSG_CREATE_SUCCESS")) {

                        // Fetching The Conversation
                        this.fetchConversations(data => {
                            this.status = "Waiting";

                            // Notifying The User
                            this.container.querySelector(".chat-widget-new-conversation-tab").innerHTML = `<div class="chat-widget-messages"><div class="chat-widget-message">Please Wait....</div></div>`;

                            // Updating Conversation
                            this.container.querySelector(".chat-widget-conversations-tab").innerHTML = data;
                            this._eventHandlers();
                            this.selectChatWidgetTab(3);
                        });
                    } else if (data.includes("MSG_SUCCESS")) {
                        this.fetchConversations(data => {
                            this.status = "Idle";
                            this.container.querySelector(".chat-widget-conversations-tab").innerHTML = data;

                            // Executing The Conversation
                            this._eventHandlers();
                            this.selectChatWidgetTab(2);
                        });
                    } else {
                        // Authentication Failed (Displaying Error Message)
                        this.container.querySelector(".chat-widget-login-tab .msg").innerHTML = data;
                    }
                });
            }
        }
    }

}