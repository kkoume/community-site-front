import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CirclePicker } from 'react-color';
import url from '../../config/url';
import axios from 'axios';

const OptionComponents = ({ rightSideHandlerClose, calendars, setEvents }) => {
    const authSlice = useSelector((state) => state.authSlice);
    const [colorBoxState, setColorBoxState] = useState(false);
    const [listColorBoxState, setListColorBoxState] = useState(false);
    const [color, setColor] = useState('#03bd9e');
    const [name, setName] = useState();
    const [target, setTarget] = useState();
    const [calendarTypes, setCalendarTypes] = useState(calendars);

    const colorBoxHandler = () => {
        setColorBoxState(true);
    }

    const calendarNameHandler = (e) => {
        console.log(e.target.value);
        setName(e.target.value);
    }

    const handleChangeComplete = color => {
        setColor(color.hex);
        setColorBoxState(false);
        console.log(color.hex);
    }

    const handleListChangeComplete = (color, e) => {

        console.log(color.hex);
        calendarTypes.map((calendar) => {
            if (calendar.id === target) {
                const updateCalendar = {
                    ...calendar,
                    ['uid']: authSlice.username,
                    ['backgroundColor']: color.hex,
                };
                console.log(updateCalendar);
                axios.post(url.backendUrl + '/calendar/type', updateCalendar)
                    .then(() => {
                        setEvents(1);
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
        });
        setListColorBoxState(false);
    }

    const listColorBoxHandler = (e) => {
        setTarget(e.target.value);
        setListColorBoxState(true);
    }

    const listNameHandler = (e) => {
        console.log(e.target.id);
        console.log(e.target.value);
        calendarTypes.map((calendar) => {
            if (calendar.id === e.target.id) {
                const updateCalendar = {
                    ...calendar,
                    ['uid']: authSlice.username,
                    ['name']: e.target.value,
                };
                console.log(updateCalendar);
                axios.post(url.backendUrl + '/calendar/type', updateCalendar)
                    .then(() => {
                        setEvents(1);
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
        });
    }

    const insertCalendarTypeHandler = () => {
        const calendarData = {
            name: name,
            backgroundColor: color,
            uid: authSlice.username,
        }

        axios.post(url.backendUrl + '/calendar/type', calendarData)
            .then((Response) => {
                console.log(Response.data);
                setCalendarTypes(calendarTypes => [...calendarTypes, Response.data]);
            })
            .catch(e => {
                console.log(e);
            })

    }

    useEffect(() => {
        const timeoutId2 = setTimeout(() => {
            const colorBox = document.getElementsByClassName("circle-picker")[0];
            if (colorBox) {
                colorBox.style.transform += 'translateX(-100%)';
                colorBox.style.transition = 'transform 0.5s ease';
            }
        }, 1);

        // Cleanup function to clear the timeout if the component unmounts
        return () => {
            clearTimeout(timeoutId2);
        }
    }, [colorBoxHandler]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const optionBox = document.getElementsByClassName("optionBox")[0];
            if (optionBox) {
                optionBox.style.transform += 'translateX(-100%)';
                optionBox.style.transition = 'transform 0.5s ease';
            }
        }, 1);

        // Cleanup function to clear the timeout if the component unmounts
        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    return (
        <div className='optionBox' onClick={rightSideHandlerClose}>

            <div className='optionContent'>
                <div className='insertCalendar'>
                    <h2>캘린더 추가</h2>
                    <div className='setCalendar'>
                        <input type='text' onChange={calendarNameHandler} placeholder='name' />
                        <button className='colorBtn' onClick={colorBoxHandler} style={{ width: '23px', height: '23px', backgroundColor: color }}>&nbsp;</button>
                        <button onClick={insertCalendarTypeHandler}>&#128190;</button>
                    </div>
                </div>
                <div className='calendarList'>
                    <h2>캘린더 관리</h2>
                    <div className='calendarType'>
                    {calendarTypes.map((calendar) => {
                        return (
                            <div>
                                <input className='text' type='text' id={calendar.id} defaultValue={calendar.name} onBlur={listNameHandler} />
                                <button value={calendar.id} className='colorBtn' onClick={listColorBoxHandler} style={{ width: '23px', height: '23px', backgroundColor: calendar.backgroundColor }}>&nbsp;</button>
                            </div>
                        )
                    })}
                    </div>
                </div>
                {colorBoxState && <CirclePicker onChangeComplete={handleChangeComplete} />}
                {listColorBoxState && <CirclePicker onChangeComplete={handleListChangeComplete} />}
            </div>
        </div>
    )
}

export default OptionComponents