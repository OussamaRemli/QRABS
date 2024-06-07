import React, { useEffect, useState } from "react";
import './Countdown.css';

function Countdown({ day, time }) {
    const [countdownTime, setCountdownTime] = useState({});

    useEffect(() => {
        if (!day || !time) {
            // Si `day` ou `time` n'est pas défini, ne faites rien
            return;
        }

        const intervalId = setInterval(() => {
            const now = new Date();
            const target = new Date();

            // Parse the time string
            const [hours, minutes, seconds] = time.split(":").map(Number);
            target.setHours(hours);
            target.setMinutes(minutes);
            target.setSeconds(seconds);
            target.setMilliseconds(0);

            // Get the target day of the week
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const targetDayIndex = daysOfWeek.indexOf(day);

            // Calculate the number of days to add to reach the target day
            let daysToAdd = (7 + targetDayIndex - now.getDay()) % 7;

            // If the target day is today but the time has already passed, add 7 days
            if (daysToAdd === 0 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes) || (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() > seconds))) {
                daysToAdd = 7;
            }

            target.setDate(now.getDate() + daysToAdd);

            const diff = target - now;

            const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
            const remainingHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const remainingMinutes = Math.floor((diff / 1000 / 60) % 60);
            const remainingSeconds = Math.floor((diff / 1000) % 60);

            setCountdownTime({
                days: remainingDays,
                hours: remainingHours < 10 ? "0" + remainingHours : remainingHours,
                minutes: remainingMinutes < 10 ? "0" + remainingMinutes : remainingMinutes,
                seconds: remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds,
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [day, time]);

    return (
        <div className="countdown-container">
            <div className="countdown">
                {countdownTime.days} jours : {countdownTime.hours} heures : {countdownTime.minutes} minutes : {countdownTime.seconds} secondes
            </div>
        </div>
    );
}

export default Countdown;


// import React, { useEffect, useState } from "react";
// import './Countdown.css';

// function Countdown({ day, time }) {
//     const [countdownTime, setCountdownTime] = useState({});

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             const now = new Date();
//             const target = new Date();

//             // Parse the time string
//             const [hours, minutes, seconds] = time.split(":").map(Number);
//             target.setHours(hours);
//             target.setMinutes(minutes);
//             target.setSeconds(seconds);
//             target.setMilliseconds(0);

//             // Get the target day of the week
//             const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//             const targetDayIndex = daysOfWeek.indexOf(day);

//             // Calculate the number of days to add to reach the target day
//             let daysToAdd = (7 + targetDayIndex - now.getDay()) % 7;

//             // If the target day is today but the time has already passed, add 7 days
//             if (daysToAdd === 0 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes) || (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() > seconds))) {
//                 daysToAdd = 7;
//             }

//             target.setDate(now.getDate() + daysToAdd);

//             const diff = target - now;

//             const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
//             const remainingHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//             const remainingMinutes = Math.floor((diff / 1000 / 60) % 60);
//             const remainingSeconds = Math.floor((diff / 1000) % 60);

//             setCountdownTime({
//                 days: remainingDays,
//                 hours: remainingHours < 10 ? "0" + remainingHours : remainingHours,
//                 minutes: remainingMinutes < 10 ? "0" + remainingMinutes : remainingMinutes,
//                 seconds: remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds,
//             });
//         }, 1000);

//         return () => clearInterval(intervalId);
//     }, [day, time]);

//     return (
//         <div className="countdown-container">
//             <div className="countdown">
//                 {countdownTime.days} jours : {countdownTime.hours} heures : {countdownTime.minutes} minutes : {countdownTime.seconds} secondes
//             </div>
//         </div>
//     );
// }

// export default Countdown;
