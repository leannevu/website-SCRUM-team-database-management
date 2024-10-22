//7/25/24 - added menu bar. decided to make- home for everyone to see easy access for current sprint, about for access to past sprints and add notes - for scrum master, product owner to deal w/ cross functional work and product backlog
//callback was interesting - need to add to database of different sprints, notes, and the current phase of sprint

let userStoryName = '';
let selectedOption = 'All'; //default filter option
const status_options = new Map([
    [1, 'Not Started'],
    [2, 'In Development'],
    [3, 'Testing'],
    [4, 'Production']
]);

const phases = new Map([
    [1, 'Sprint Planning'],
    [2, 'Daily Scrum'],
    [3, 'Review'],
    [4, 'Retrospective']
]);

const phasesImgURLs = new Map([
    [1, 'sprint-planning'],
    [2, 'daily-scrum'],
    [3, 'review'],
    [4, 'retrospective']
]);

let currentPhaseImgUrl;

fetchUserStories();
fetchSprint();

function fetchSprint() {
    console.log('function in');
    $.ajax({
        url: 'database.php',
        type: 'POST',
        data: {
            action: 'fetch_sprint'
        },
        dataType: 'json',
        success: function(response) {
                        // Parse the JSON response
            console.log('Server response:', response);
            
            phases.forEach((value, key) => {
                if (value == response[0].phase)
                    currentPhaseImgUrl = phasesImgURLs.get(key);
                    console.log("current phase" + currentPhaseImgUrl);
            })

            var htmlContent = '<h2>Current phase is ' + response[0].phase + '</h2>'
            htmlContent += '\n<img src="' + currentPhaseImgUrl + '.jpg" width="500" height="300">'
            
            // Append the HTML content to the table body
            $('#current-phase-box').html(htmlContent);
            //$('#current-phase-h2').html(htmlContent2);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
     });

}


document.addEventListener('DOMContentLoaded', function() {

    //Event listener for clicking on sprint backlog list

    const list = document.querySelector('#backlog-list');
    list.addEventListener('click', function(e) {
        // Check if the clicked element is a list item
        if (e.target && e.target.nodeName === "LI") {
            // Remove highlighted class from previously selected item
            const current = list.querySelector('.highlighted');
            if (current && current !== e.target) {
                current.classList.remove('highlighted');
            }
            // Toggle highlight class on the clicked item
            e.target.classList.toggle('highlighted');

            // Get the text content of the clicked list item
            userStoryName = e.target.textContent || e.target.innerText;

            fetchTeamMembers();
            fetchStoryPoints();
        }
    });

    const filter_sprint_option = document.querySelector('.filter_option select');
    filter_sprint_option.addEventListener('change', function() {
        selectedOption = this.options[this.selectedIndex].text;
        fetchUserStories();
    });

    const push_status_button = document.querySelector('#push-status');
// 7/19/24 trying to use call back functions to make a function that'll return a data retrieved variable
// doing this for better organization - reuse functions, make look cleaner, abstraction, recouplkng idk
    push_status_button.addEventListener('click', function() {
        updateStoryStatus('Push');
    });

    const reverse_status_button = document.querySelector('#reverse-status')
    reverse_status_button.addEventListener('click', function() {
        updateStoryStatus('Reverse');
    })

    const next_phase_button = document.querySelector('#next-phase-button');
    next_phase_button.addEventListener('click', function(){
        updateSprint('Push');
    })

    const reverse_phase_button = document.querySelector('#reverse-phase-button');
    reverse_phase_button.addEventListener('click', function(){
        updateSprint('Reverse');
    })




});

function updateSprint(update) {
    let currentPhaseKey;
    getCurrentPhaseHelper(function(status) {
        //use callback function for the current status
        phases.forEach((value, key) => {
            if (status == value) {
                currentPhaseKey = key;
            }
        })
        
        let newPhase;
        if(update == 'Push' && currentPhaseKey <= 4 && currentPhaseKey >= 1) {
            let newPhaseKey = currentPhaseKey + 1;
            newPhase = phases.get(newPhaseKey);
        } else if(update == 'Reverse' && currentPhaseKey <= 4 && currentPhaseKey >= 1) {
            let newPhaseKey = currentPhaseKey - 1;
            newPhase = phases.get(newPhaseKey);
        }

        //update database 
        $.ajax({
            url: 'database.php',
            type: 'POST',
            data: {
                newPhaseText: newPhase,
                phaseNumberText: 4,
                action: 'updatePhase'
            },
            dataType: 'json',
            success: function(response) {
                console.log('Server response:', response);
            }
        });
        fetchSprint();
    });
}

function getCurrentPhaseHelper(callback) {
    var phaseResult;
    $.ajax({ 
        url: 'database.php',
        type: 'POST',
        data: {
            action: 'fetch_sprint'
        },
        dataType: 'json',
        success: function(response) {
            // Parse the JSON response
            phaseResult = response[0].phase;  
            callback(phaseResult); //callback
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            callback(null);
        }
    });
}

function updateStoryStatus(update) {
    let currentStatusKey;
    getCurrentStatusHelper(function(status) {
        //use callback function for the current status
        status_options.forEach((value, key) => {
            if (status == value) {
                currentStatusKey = key;
            }
        })
        let newStatus;

        
        if (update == 'Push') { //update status to the phase after the current status - no updates if reached end
            let newStatusKey = currentStatusKey + 1;
            newStatus = status_options.get(newStatusKey);
        } else { //update status to the phase before the current status - no updates if reached beginning
            let newStatusKey = currentStatusKey - 1;
            newStatus = status_options.get(newStatusKey);
        }

        //update database 
        $.ajax({
            url: 'database.php',
            type: 'POST',
            data: {
                newStatusText: newStatus,
                userStoryText: userStoryName,
                action: 'updateStatus'
            },
            dataType: 'json',
            success: function(response) {
                console.log('Server response:', response);
            }
        });
        fetchStoryPoints()
    });
}

function getCurrentStatusHelper(callback) {
    var statusResult;
    $.ajax({ 
        url: 'database.php',
        type: 'POST',
        data: {
            itemText: userStoryName,
            action: 'fetch_story_points'
        },
        dataType: 'json',
        success: function(response) {
            // Parse the JSON response
            statusResult = response[0].status;  
            callback(statusResult); //callback
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            callback(null);
        }
    });
}

function fetchUserStories() {
    if (selectedOption != "All") { //send in filter value for to use WHERE in query
    $.ajax({
        url: 'database.php',
        type: 'POST',
        data: {      
            action: 'fetch_sprint_stories',
            itemText: selectedOption
        },
        dataType: 'json',  // Ensure this is set if you expect JSON
        success: function(response) {
            // Parse the JSON response
            //console.log('Server response:', response);
            var htmlContent = '';
    
            // Loop through each story and create HTML content
            for (var i = 0; i < response.length; i++) {
                htmlContent += '<li>' + response[i].user_story_name +
                               '</li>';
            }
    
            // Append the HTML content to the table body
            $('#backlog-list').html(htmlContent);
    
            //Click on the first list item
            const firstListItem = document.querySelector('#backlog-list li');
                if (firstListItem) {
                    firstListItem.click(); // Simulate click on the first list item
                }
   
        },
        error: function(xhr) {
            console.log("An error occurred:d " + xhr.status + " " + xhr.statusText);
        }
    
    });
    } else { //no need to send in filter value as there is no need to use WHERE in query
        $.ajax({
            url: 'database.php',
            type: 'POST',
            data: {      
                action: 'fetch_sprint_stories',
            },
            dataType: 'json',  // Ensure this is set if you expect JSON
            success: function(response) {
                // Parse the JSON response
                //console.log('Server response:', response);
                var htmlContent = '';
        
                // Loop through each story and create HTML content
                for (var i = 0; i < response.length; i++) {
                    htmlContent += '<li>' + response[i].user_story_name +
                                   '</li>';
                }
        
                // Append the HTML content to the table body
                $('#backlog-list').html(htmlContent);
        
                //Click on the first list item
                const firstListItem = document.querySelector('#backlog-list li');
                    if (firstListItem) {
                        firstListItem.click(); // Simulate click on the first list item
                    }
       
            },
            error: function(response) {
                console.log("An error occurred:s " + xhr.status + " " + xhr.statusText);
                console.log(response);
            }
        });
    }
    // Call fetchData on page load
    $(document).ready(function() {
    });
}

function fetchTeamMembers() {
    // Send the userStoryName to the PHP server
    $.ajax({
       url: 'database.php',
       type: 'POST',
       data: {
           itemText: userStoryName,
           action: 'fetch_assign_members'
       },
       dataType: 'json',
       success: function(response) {
                       // Parse the JSON response
           //console.log('Server response:', response);
           var htmlContent = '';
    
           // Loop through each story and find employees
           for (var i = 0; i < response.length; i++) {
               htmlContent += '<li>' + response[i].employee_name + ' [' + response[i].role + ']'+
                          '</li>';
           }
    
       // Append the HTML content to the table body
       $('#team-list').html(htmlContent);
       },
       error: function(xhr, status, error) {
           console.error('Error:', error);
       }
    });

}

function fetchStoryPoints() {
    // Send the userStoryName to the PHP server
$.ajax({
   url: 'database.php',
   type: 'POST',
   data: {
       itemText: userStoryName,
       action: 'fetch_story_points'
   },
   dataType: 'json',
   success: function(response) {
                   // Parse the JSON response
       //console.log('Server response:', response);
       document.querySelector("#story-points").innerHTML = userStoryName;
       
       var htmlContent = '<tr><th>Story Points</th><th>Status</th></tr>';
       htmlContent += '<tr><td> '+ response[0].story_points + ' </td><td> ' + response[0].status+ ' </td></tr>';
       
       // Append the HTML content to the table body
       $('.about table').html(htmlContent);
   },
   error: function(xhr, status, error) {
       console.error('Error:', error);
   }
});
}