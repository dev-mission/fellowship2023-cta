import { useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

TimeRange.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

function convertISOTime(time, date) {
  if (time === null) {
    return '';
  }
  let dt = DateTime.now().setZone("America/Los_Angeles");
  const [hour, minute] = time.split(':');
  dt = dt.set({ hour: parseInt(hour), minute: parseInt(minute) });
  let newDate = date + " "+ dt.toISOTime();
  return newDate;
}

export default function TimeRange({ name, data, setData }) {
  const [time, setTime] = useState(['']);

  return (
    <div>
      <TimePicker
        name={name}
        disableClock={true}
        onChange={(value) => {
          setTime(value);
          setData({ ...data, [name]: convertISOTime(value, data.dateOn) });
        }}
        value={time}
      />
    </div>
  );
}
