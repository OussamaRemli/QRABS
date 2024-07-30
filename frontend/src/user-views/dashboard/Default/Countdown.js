import React from 'react';
import { HourglassEmpty } from '@mui/icons-material';
import './Countdown.css';

class Countdown extends React.Component {
    state = {
        totalSeconds: 75 * 60 + 5, // 1 heure 15 minutes 5 secondes
        seconds: 75 * 60 + 5
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            const { seconds } = this.state;

            if (seconds > 0) {
                this.setState({ seconds: seconds - 1 });
            } else {
                clearInterval(this.interval);
            }
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    formatTime(seconds) {
        const days = Math.floor(seconds / (24 * 3600));
        const hours = Math.floor((seconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return {
            days,
            hours,
            minutes,
            seconds: secs
        };
    }

    render() {
        const { seconds } = this.state;
        const { days, hours, minutes, seconds: displaySeconds } = this.formatTime(seconds);

        return (
            <div className="countdown">
                <HourglassEmpty className="countdown-icon" />
                <h1 className='title'>La séance prochaine</h1>
                <div className="countdown-values">
                    <div className="countdown-item">
                        <div className="countdown-number">{days}</div>
                        <div className="countdown-label">jours</div>
                    </div>
                    <div className="countdown-item">
                        <div className="countdown-number">{hours}</div>
                        <div className="countdown-label">heures</div>
                    </div>
                    <div className="countdown-item">
                        <div className="countdown-number">{minutes}</div>
                        <div className="countdown-label">minutes</div>
                    </div>
                    <div className="countdown-item">
                        <div className="countdown-number">{displaySeconds}</div>
                        <div className="countdown-label">secondes</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Countdown;





// import React from 'react';
// import moment from 'moment';
// import { HourglassEmpty } from '@mui/icons-material';
// import './Countdown.css';

// class Countdown extends React.Component {
//     state = {
//         days: undefined,
//         hours: undefined,
//         minutes: undefined,
//         seconds: undefined
//     };

//     componentDidMount() {
//         this.interval = setInterval(() => {
//             const { timeTillDate, timeFormat } = this.props;
//             const then = moment(timeTillDate, timeFormat);
//             const now = moment();
//             const countdown = moment.duration(then.diff(now));
//             const days = countdown.days();
//             const hours = countdown.hours();
//             const minutes = countdown.minutes();
//             const seconds = countdown.seconds();

//             this.setState({ days, hours, minutes, seconds });
//         }, 1000);
//     }

//     componentWillUnmount() {
//         if (this.interval) {
//             clearInterval(this.interval);
//         }
//     }

//     render() {
//         const { days, hours, minutes, seconds } = this.state;

//         if (days === undefined) {
//             return null;
//         }

//         return (
//             <div className="countdown">
//                 <HourglassEmpty className="countdown-icon" />
//                 <h1>La séance prochaine</h1>
//                 <div className="countdown-values">
//                     {days !== undefined && (
//                         <div className="countdown-item">
//                             <div className="countdown-number">{days}</div>
//                             <div className="countdown-label">jours</div>
//                         </div>
//                     )}
//                     {hours !== undefined && (
//                         <div className="countdown-item">
//                             <div className="countdown-number">{hours}</div>
//                             <div className="countdown-label">heures</div>
//                         </div>
//                     )}
//                     {minutes !== undefined && (
//                         <div className="countdown-item">
//                             <div className="countdown-number">{minutes}</div>
//                             <div className="countdown-label">minutes</div>
//                         </div>
//                     )}
//                     {seconds !== undefined && (
//                         <div className="countdown-item">
//                             <div className="countdown-number">{seconds}</div>
//                             <div className="countdown-label">secondes</div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     }
// }

// export default Countdown;
