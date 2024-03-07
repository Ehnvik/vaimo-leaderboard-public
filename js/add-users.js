import { drivers } from "./drivers.js"

let selectedDriver = null
let firstName = ""
let lastName = ""

$( ()=> {
$('.user-add-form').on('submit', createNewUser)
displayDrivers()
displayUsers()
disableChosenDrivers()
checkUsersAndToggleContinueButton()
handleContinueAndHomeBtn()
nameToLowerCase()
toggleSelectedDriverClass()
})


const toggleSelectedDriverClass = () => {
    $(document).on('click', '.driver-img', function() {
        const driverId = $(this).data('driver-id').toString();
        if (selectedDriver && selectedDriver.id === driverId) {
            selectedDriver = null;
            $('.driver-img').removeClass('driver-selected');
        } else {
            selectedDriver = drivers.find(driver => driver.id === driverId);
            $('.driver-img').removeClass('driver-selected');
            $(this).addClass('driver-selected');
        }
    });
}

const nameToLowerCase = () => {
    $('#first-name-input').on('change', function() {
        firstName = $(this).val().trim().toLowerCase();
    });
    $('#last-name-input').on('change', function() {
        lastName = $(this).val().trim().toLowerCase();
    });
}

const disableChosenDrivers = () => {
    const users = getUsers();
    $('.driver-img').each(function() {
        const driverId = $(this).data('driver-id').toString();
        const isChosen = users.some(user => user.driver && user.driver.id === driverId);

        if (isChosen) {
            $(this).addClass('driver-taken');
        } else {
            $(this).removeClass('driver-taken');
            $('.driver-img').removeClass('driver-selected');
        }
    });
};


const createNewUser = (e) => {
        e.preventDefault()
       if(firstName === '' || lastName === '') {
        $('#name-message').text('Please enter your full name')
        setTimeout(() => {
            $('#name-message').text('');
        }, 5000);
        $('.driver-img').removeClass('driver-selected');
       } else if(firstName.length > 25 || lastName.length > 25) {
        $('#name-message').text('Please shortern your name')
        setTimeout(() => {
            $('#name-message').text('');
        }, 5000);
       } else if (selectedDriver === null) {
        $('#driver-message').text('Please select your representative driver')
        setTimeout(() => {
            $('#driver-message').text('');
        }, 5000);
       } else  {
        checkIfDriverIsTaken(selectedDriver)
        $('#driver-message').text('Your profile and driver selection have been successfully saved!')
        setTimeout(() => {
            $('#driver-message').text('');
        }, 5000);
       }
       
       firstName = ''
       lastName = ''
       selectedDriver = null
       $('#first-name-input').val('')
       $('#last-name-input').val('')
}

const checkIfDriverIsTaken = (selectedDriver) => {
    const users = getUsers()
    const driver = users.find(user => user.driver.id === selectedDriver.id)
    $('#error-message').text('')
    if(driver) {
        $('#driver-message').text(`Driver "${driver.driver.name}" already chosen`)
        setTimeout(() => {
            $('#driver-message').text('');
        }, 5000);
    } else {
        createUserObject()
    }
}

const createUserObject = () => {
    const user = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        time: "",
        driver: { 
            id: selectedDriver.id,
            name: selectedDriver.name,
            team: selectedDriver.team,
            img: selectedDriver.img
        }
   }
   saveUser(user)
}

export const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || []
}

export const sendUsers = (users) => {
    return localStorage.setItem('users', JSON.stringify(users))
}

const saveUser = (user) => {
    const users = getUsers()
    users.push(user)
    sendUsers(users)
    displayUsers()
    disableChosenDrivers()
    checkUsersAndToggleContinueButton()
}

const deleteUser = () => {
    let users = getUsers()
    $('.delete-user-btn').on('click', (e) => {
        const userId = e.currentTarget.getAttribute('id')
        users = users.filter(user => user.id.toString() !== userId)
        sendUsers(users)
        displayUsers()
        checkUsersAndToggleContinueButton()
        disableChosenDrivers()
    })
}

const checkUsersAndToggleContinueButton = () => {
    const users = getUsers()
    if (users.length > 0) {
        $('#continue-btn').removeAttr('disabled');
        $('#continue-btn').removeClass('continue-btn-disable');
    } else {
        $('#continue-btn').attr('disabled', 'disabled');
        $('#continue-btn').addClass('continue-btn-disable');
    }
}

const handleContinueAndHomeBtn = () => {
    $('#continue-btn').on('click', function() {
        if (!$(this).is(':disabled')) {
            window.location.href = $(this).data('url');
        }
    });

    $('#back-btn').on('click', function() {
        window.location.href = $(this).data('url');
    });
}

const displayDrivers = () => {
    let html = ''; 

    drivers.forEach(driver => {
        html += `
            <div class="driver-container">
                <img class="driver-img" src="${driver.img}" data-driver-id="${driver.id}" alt="Image on ${driver.name}">
                <h3 class="driver-name">${driver.name}</h3>
                <p class="driver-team">${driver.team}</p>
            </div>
        `;
    });

    $('.drivers-slider').html(html); 
    initializeSlider(); 
};

const displayUsers = () => {
    const users = getUsers()
        let html = '<div class="users-list">'
        users.forEach(user => {
         const firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1)
         const lastName = user.lastName[0].toUpperCase() + user.lastName.slice(1)
         const userImageSrc = user.driver?.img ?? 'img/404.webp';
            html += `
                <div class="user-container">
                <img class="user-img" src="${userImageSrc}" alt="Image of ${user.driver?.name ?? '404 image'}">
                <p class="first-name">${firstName}</p>
                <p class="last-name">${lastName}</p>
                    <i class="fa-solid fa-delete-left delete-user-btn" id="${user.id}"></i>
                </div>
            `
        })
    
        html += '</div>'
        $('#user-list-wrapper').html(html) 
        deleteUser()
}

const initializeSlider = () => {
    $('.drivers-slider').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    })
}