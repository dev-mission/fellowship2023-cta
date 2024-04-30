import UserStats from '../Statistics/UserStats';
import LocationStats from '../Statistics/LocationStats';
export default function AdminStats() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <UserStats></UserStats>
        </div>
        <div className="col">
          <LocationStats></LocationStats>
        </div>
      </div>
    </div>
  );
}
