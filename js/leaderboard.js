import { getUsers, sendUsers } from "./add-users.js"

$(() => {
    $('.time-form').on('submit', collectTimeData)
    selectUser()
    displayLeaderboard()
    handleResetAndBackBtn()
})

const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
};

const sortUsersByTime = () => {
    const users = getUsers();

    return users.sort((a, b) => {
        if (a.time === '' && b.time === '') return 0; 
        if (a.time === '') return 1; 
        if (b.time === '') return -1; 

        return timeToSeconds(a.time) - timeToSeconds(b.time);
    });
};


const selectUser = () => {
    const users = getUsers();

    const sortedUsers = users.sort((a, b) => {
        const nameA = a.firstName.toLowerCase() + a.lastName.toLowerCase();
        const nameB = b.firstName.toLowerCase() + b.lastName.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    })

    const userSelect = $('#user-select');
    userSelect.empty();

    sortedUsers.forEach((user) => {
        const firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1)
        const lastName = user.lastName[0].toUpperCase() + user.lastName.slice(1)
        userSelect.append(`<option value="${user.id}">${firstName} ${lastName}</option>`);
    });
}

const collectTimeData = (e) => {
    e.preventDefault()
    const minutes = $('#minutes-input').val()
    const seconds = $('#seconds-input').val()

    $('#minutes-input').val('')
    $('#seconds-input').val('')

    validateTimeData(minutes, seconds)
}

const validateTimeData = (minutes, seconds) => {
    $('#time-error-message').text('')
    const mins = Number(minutes);
    const secs = Number(seconds);
    if ((mins >= 0 && secs >= 0) && (mins < 60 && secs < 60) && (mins > 0 || secs > 0 || (minutes === '00' && seconds === '00'))) {
        formatTimeData(minutes, seconds)
        $('#time-message').text('Time updated')
        setTimeout(() => {
            $('#time-message').text('');
        }, 5000);
    } else {
        $('#time-message').text('Please add correct numbers')
        setTimeout(() => {
            $('#time-message').text('');
        }, 5000);
    }
}

const formatTimeData = (minutes, seconds) => {
    const time = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    updateUserTime(time)
}

const updateUserTime = (time) => {
    const users = getUsers()
    const userId = $('#user-select').val()

    const userIndex = users.findIndex(user => user.id.toString() === userId)
    if(userIndex !== -1) {
        users[userIndex].time = time;
        sendUsers(users)
        displayLeaderboard()
    }
}

const handleResetAndBackBtn = () => {
    $('#reset-btn').on('click', function() {
        const confirmReset = confirm('Are you sure you want to reset the leaderboard?');
        if (confirmReset) {
            resetLeaderboard();
        }
    });

    $('#back-btn').on('click', function() {
        window.location.href = $(this).data('url');
    });
}

const resetLeaderboard = () => {
    const users = getUsers().map(user => ({ ...user, time: '' }));
    sendUsers(users);
    displayLeaderboard();

    $('#reset-message').text('Leaderboard has been reset.');
    setTimeout(() => {
        $('#reset-message').text('');
    }, 5000);
}


const displayLeaderboard = () => {
    const users = sortUsersByTime()
    let html = '<div class="leaderboard-list">'
    users.forEach((user, index) => {
        const firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1)
        const lastName = user.lastName[0].toUpperCase() + user.lastName.slice(1)
        html += `
        <div class="user-position-container">
            <p class="user-position-number">${index + 1}</p>
            <img class="user-img" src="${user.driver.img}" alt="Image of ${user.driver.name}">
            <p class="user-name">${firstName} ${lastName}</p>
            <p class="user-time">${user.time !== '' ? user.time : '00:00'}</p>
        </div>
        `
    })

    html += '</div>'
    $('#leaderboard-list-container').html(html) 
}