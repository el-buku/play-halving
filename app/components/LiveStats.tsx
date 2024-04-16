export const LiveStats = () => {
  return (
    <div className="live">
      <div className="container">
        <div className="live-frame">
          <div className="live-banner">
            <h2 className="live-stats">Live Stats</h2>
            <img
              className="live-icon"
              src="img/live.png"
              alt="Live stats icon"
              title="Live Stats"
            />
          </div>
          <img src="img/diamonds-btc.png" alt="Diamonds to Bitcoin" />
        </div>
        <div className="live-table-container">
          <table className="w-100">
            <thead>
              <tr>
                <th>Wallet Address</th>
                <th>Bet Time</th>
                <th>Ticket No (TX)</th>
                <th>Ticket Owned</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1Kf28gYz9WUzvxE8H7XVb3s6iZpN2q5coA</td>
                <td>12th Apr, 2024 at 6:22 PM</td>
                <td>TX12265489965479</td>
                <td className="ticket-owned">
                  <div className="white-pill">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>10</span>
                  </div>
                </td>
              </tr>
              {/* Additional rows would go here */}
              <tr>
                <td>3J9h4TNzVQq7JHMXBLwJkT5oZCMvnKZqaA</td>
                <td>13th Apr, 2024 at 10:15 AM</td>
                <td>TX87954123698741</td>
                <td className="ticket-owned">
                  <div className="white-pill">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>5</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>1LYu678hfuN9JKL5m2C3T4aqWXMpNBvRJZ</td>
                <td>14th Apr, 2024 at 3:42 PM</td>
                <td>TX23571148903215</td>
                <td className="ticket-owned">
                  <div className="white-pill">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>2</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
