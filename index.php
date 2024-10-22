

<head>
    <meta charset = "utf-8">
    <title>Sprint Team</title>
    <link rel="stylesheet" href="stylesheet.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>


    <script src="index.js"></script>
    <div class="navbar">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Product Owner</a>
    </div>

    <div class="container">
        <div class="box">
            <h2>Sprint Backlog</h2>
            <ul id="backlog-list">
                <li>US 1</li>
            </ul>            
        </div>
        <div class="box">
            <h2>Team Members</h2>
            <ul id="team-list">
                <li>Alice</li>
            </ul>
        </div>
    </div>

    <div class="filter_option">
    <select>
            <option>All</option>
            <option>Not Started</option>
            <option>In Development</option>
            <option>Testing</option>
            <option>Production</option>
    </select>
    </div>

    <div class="about">
        <h1 id= "story-points">Story Points</h1>
        <table>
            <tr>
                <th>Story Points</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>Story</td>
                <td>Story</td>
            </tr>
        </table>
        <button id="push-status">Push Status</button>
        <button id ="reverse-status">Reverse Status</button>
    </div>

    <div class ="container">
        <div class = "sprint-box">
            <div id="current-phase-box">
                <h2>Current Phase</h2>
            </div>
            <button id="next-phase-button">Next Phase</button>
            <button id="reverse-phase-button">Reverse Phase</button>
        </div>
        <div class = "sprint-box">
            <h2>Next Sprint</h2>
        </div>
        <div class = "sprint-box">
            <h2>Notes From Last Phase</h2>
        </div>
    </div>
</body>

</html>