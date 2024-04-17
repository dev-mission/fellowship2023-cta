import { useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

TimeRange.propTypes = {
  change: PropTypes.func,
  name: PropTypes.string,
  date: PropTypes.string,
};

function convertISOTime(time, date) {
  if (time === null) {
    return '';
  }
  let dt = DateTime.now().setZone('America/Los_Angeles');
  const [hour, minute] = time.split(':');
  dt = dt.set({ hour: parseInt(hour), minute: parseInt(minute) });
  let newDate = date + ' ' + dt.toISOTime();
  return newDate;
}

export default function TimeRange({ date, change, name }) {
  const [time, setTime] = useState(['']);

  return (
    <div>
      <TimePicker
        name={name}
        disableClock={true}
        value={time}
        onChange={(value) => {
          setTime(value);
          change({ target: { name: name, value: convertISOTime(value, date) } });
        }}
      />
    </div>
  );
}
