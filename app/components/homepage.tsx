"use client";
import React, { useEffect, useRef, useState } from "react";
import "../app/style/homepage.css";
import CustomHead from "@/components/HomepageHeader";
export const Homepage: React.FC = () => {
  const [sliderValue, setSliderValue] = useState<any>(50);
  const sliderRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const updateDivPosition = (value: number) => {
    if (sliderRef.current && tooltipRef.current) {
      const slider = sliderRef.current;
      const tooltip = tooltipRef.current;
      const position =
        ((value - 1) / (100 - 1)) * (slider.offsetWidth - tooltip.offsetWidth);
      tooltip.style.left = `${position}px`;
      tooltip.style.display = "flex";
    }
  };

  useEffect(() => {
    const progressPercent = (sliderValue / 100) * 100;
    console.log("aici");
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, #7b3dff ${progressPercent}%, #ccc 0%)`;
    }
    updateDivPosition(sliderValue);
  }, [sliderValue]);
  return (
    <>
      <CustomHead />
      <body>
        <div className="guess-container">
          <div className="prog-cnt">
            <div className="container">
              <div className="slidecontainer">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value="50"
                  style={{ position: "relative" }}
                  className="slider"
                  id="myRange"
                  ref={sliderRef}
                />
                <div
                  className="tool"
                  ref={tooltipRef}
                  id="tooltip"
                  style={{ display: "none" }}
                >
                  <span id="demo">50</span>Minimum tickets Left To Execute The
                  Draw
                </div>
              </div>
            </div>
          </div>
          <div className="guess">
            <div className="container">
              <div className="guess-title">
                Guess The Exact Date And Time For Bitcoin Halving And Win
                <span style={{ color: "#ff8c00" }}>100,000</span> USDT
              </div>
              <div className="flex-btc">
                <div className="btc-1">
                  <img src="../img/BTC1.png" alt="" />
                </div>
                <div className="btc-2">
                  <img src="../img/BTC2.png" alt="" />
                </div>
                <div className="btc-4">
                  <img src="../img/BTC4.png" alt="" />
                </div>
                <div className="btc-5">
                  <img src="../img/BTC5.png" alt="" />
                </div>
                <div className="stone-2">
                  <img src="../img/stone2.png" alt="" />
                </div>
                <div className="stone-3">
                  <img src="../img/stone3.png" alt="" />
                </div>
                <div className="hammer">
                  <img src="../img/hammer.png" alt="" />
                </div>
                <img
                  className="btc-img"
                  src="../img/big.png"
                  alt="Mining bitcoins image for casino lottery."
                />
              </div>
              <div className="mobile-btc d-none">
                <img src="../img/bitcoins.png" alt="" />
              </div>
              <div className="count-down-card">
                <div className="count-down-first-section">
                  <div className="you-have">
                    You have <span className="blue-bbl">12 Chance</span> Of
                    <span className="purple-bets">15 Bets</span>
                  </div>
                  <div className="guess-number">
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">Months</span>
                    </div>
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">Days</span>
                    </div>
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">Hours</span>
                    </div>
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">Minutes</span>
                      <img src="../img/20.png" alt="Get 20% back" />
                    </div>
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">Seconds</span>
                      <img src="../img/50.png" alt="Get 50% back" />
                    </div>
                    <div className="count-down">
                      <input type="number" placeholder="?" />
                      <span className="month">M.Secs</span>
                      <img
                        style={{ right: 0 }}
                        src="../img/usdt.png"
                        alt="Get big prize 100k USDT"
                      />
                    </div>
                  </div>
                </div>
                <div className="count-down-last-section">
                  <button className="green-ticket">
                    Get 1 Ticket For 5.00 USDT
                  </button>
                  <div className="flex-purple-tickets">
                    <div className="purple-ticket">
                      <img src="../img/purple-tiket.png" alt="" />
                      <span>Buy 2 tickets</span>
                    </div>
                    <div className="purple-ticket">
                      <img src="../img/purple-tiket.png" alt="" />
                      <span>Buy 5 tickets</span>
                    </div>
                    <div className="purple-ticket">
                      <img src="../img/purple-tiket.png" alt="" />
                      <span>Buy 10 tickets</span>
                    </div>
                    <div className="purple-ticket">
                      <img src="../img/purple-tiket.png" alt="" />
                      <span>Buy 15 tickets</span>
                    </div>
                  </div>
                  <div className="last-info">
                    <img src="../img/fi-rr-info.svg" alt="" />
                    <span className="last-purple-text">
                      For Each 5 played tickets accquired you will receive 3
                      extra bets for free
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="game">
            <div className="container">
              <div className="game-rules">
                <img src="../img/crushed-btc.png" alt="Bitcoin" />
                <div className="flex-game">
                  <div className="game-title">Game Rules</div>
                  <div className="note">
                    Please note: Each entry is represented by a unique NFT,
                    which you can claim
                  </div>
                </div>
              </div>
              <div className="prizes">
                <div className="first-frame">
                  <img src="../img/thron.png" alt="" />
                  <span>
                    Win 1000,000 USDT by precisely predicting the exact date and
                    time, down to the millisecond, of the upcoming Bitcoin
                    halving!
                  </span>
                </div>
                <div className="second-frame">
                  <img src="../img/trophy.png" alt="" />
                  <span>
                    The moment the Bitcoin halving occurs, we’ll determine the
                    winner based on who made the earliest correct prediction.
                  </span>
                </div>
                <div className="third-frame">
                  <img
                    style={{ top: -50 + "px", maxWidth: 60 + "px" }}
                    src="../img/hand.png"
                    alt=""
                  />
                  <span>
                    If you correctly predict the date, hour, minute, and second,
                    you’ll be rewarded with a refund of 50% of the ticket’s
                    value in USDT.
                  </span>
                </div>
                <div className="fourth-frame">
                  <img
                    style={{ top: -35 + "px", maxWidth: 160 + "px" }}
                    src="../img/blue-ticket.png"
                    alt=""
                  />
                  <span>
                    Guessing the correct date, hour, and minute earns you 25% of
                    the ticket’s value back.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="live">
            <div className="container">
              <div className="live-frame">
                <div className="live-banner">
                  <div className="live-stats">Live Stats</div>
                  <img
                    style={{ maxWidth: 80 + "px" }}
                    src="../img/live.png"
                    alt="Live rec img"
                  />
                </div>
                <img
                  style={{ maxWidth: 317 + "px" }}
                  src="../img/diamonds-btc.png"
                  alt=""
                />
              </div>
              <div style={{ overflowX: "auto" }}>
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
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <div className="white-pill">
                          <img src="../img/purple-tiket.png" alt="" />
                          <span>10</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>1Kf28gYz9WUzvxE8H7XVb3s6iZpN2q5coA</td>
                      <td>12th Apr, 2024 at 6:22 PM</td>
                      <td>TX12265489965479</td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <div className="white-pill">
                          <img src="../img/purple-tiket.png" alt="" />
                          <span>10</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>1Kf28gYz9WUzvxE8H7XVb3s6iZpN2q5coA</td>
                      <td>12th Apr, 2024 at 6:22 PM</td>
                      <td>TX12265489965479</td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <div className="white-pill">
                          <img src="../img/purple-tiket.png" alt="" />
                          <span>10</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="footer-purple">
              <div className="text-footer">
                DISCLIMER:
                <br />
                As the Bitcoin having will not return the millisecond of the
                halving this will be randomly extracted
              </div>
              <img
                style={{ maxWidth: "170px", borderRadius: "0 24px 24px 0" }}
                src="../img/footer-bitcoin.png"
                alt="Bitcoin mining"
              />
            </div>
          </div>
        </div>
      </body>
    </>
  );
};
