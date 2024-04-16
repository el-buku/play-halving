import { LiveStats } from "../LiveStats";

export const Homepage = () => {
  return (
    <>
      <div className="guess-container">
        <div className="prog-cnt">
          <div className="container">
            <div className="flex-navbar">
              <img className="logo" src="img/logo.png" alt="" />
              <div className="slidecontainer">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value="50"
                  style={{ position: "relative" }}
                  className="slider"
                  id="myRange"
                />
                <div className="tool" id="tooltip">
                  <span id="demo">50</span>Minimum tickets Left To Execute The
                  Draw
                </div>
              </div>
              <button
                type="button"
                className="connect-wallet"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                <img src="img/fi-rr-plug.svg" alt="" />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
        </div>
        <div className="guess">
          <div className="container">
            <div className="guess-title">
              Guess The Exact Second For The Bitcoin Halving And Win
              <span style={{ color: "#ff8c00" }}>50,000</span> USDC
            </div>
            <div className="flex-btc">
              <div className="btc-1">
                <img src="img/BTC1.png" alt="" />
              </div>
              <div className="btc-2">
                <img src="img/BTC2.png" alt="" />
              </div>
              <div className="btc-4">
                <img src="img/BTC4.png" alt="" />
              </div>
              <div className="btc-5">
                <img src="img/BTC5.png" alt="" />
              </div>
              <div className="stone-2">
                <img src="img/stone2.png" alt="" />
              </div>
              <div className="stone-3">
                <img src="img/stone3.png" alt="" />
              </div>
              <div className="hammer">
                <img src="img/hammer.png" alt="" />
              </div>
              <img
                className="btc-img"
                src="img/big.png"
                alt="Mining bitcoins image for casino lottery."
              />
            </div>
            <div className="mobile-btc d-none">
              <img src="img/bitcoins.png" alt="" />
            </div>
            <div className="count-down-card">
              <div className="count-down-first-section">
                <div className="you-have">
                  You have <span className="blue-bbl">12 Chance</span> Of
                  <span className="purple-bets">15 Bets</span>
                </div>
                <div className="guess-number">
                  <div className="count-down">
                    <input
                      type="number"
                      className="numberInput"
                      placeholder=""
                      maxLength={3}
                    />
                    <span className="month">Months</span>
                  </div>
                  <div className="count-down">
                    <input
                      type="number"
                      className="numberInput"
                      placeholder=""
                      maxLength={3}
                    />
                    <span className="month">Days</span>
                  </div>
                  <div className="count-down">
                    <input
                      type="number"
                      className="numberInput"
                      placeholder=""
                      maxLength={3}
                    />
                    <span className="month">Hours</span>
                    <img src="img/20%.png" alt="" />
                  </div>
                  <div className="count-down">
                    <input
                      type="number"
                      className="numberInput"
                      placeholder=""
                      maxLength={3}
                    />
                    <span className="month">Minutes</span>
                    <img src="img/50%25.png" alt="" />
                  </div>
                  <div className="count-down">
                    <input
                      type="number"
                      className="numberInput"
                      placeholder=""
                      maxLength={3}
                    />
                    <span className="month">Seconds</span>
                    <img
                      style={{ right: "14%", maxWidth: 142 }}
                      src="img/prize-50.png"
                      alt="Get big prize 50k USDC"
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
                    <img src="img/purple-tiket.png" alt="" />
                    <span>Buy 2 tickets</span>
                  </div>
                  <div className="purple-ticket">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>Buy 5 tickets</span>
                  </div>
                  <div className="purple-ticket">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>Buy 10 tickets</span>
                  </div>
                  <div className="purple-ticket">
                    <img src="img/purple-tiket.png" alt="" />
                    <span>Buy 15 tickets</span>
                  </div>
                </div>
                <div className="last-info">
                  <img src="img/fi-rr-info.svg" alt="" />
                  <span className="last-purple-text">
                    For Each 5 played tickets accquired you will receive 3 extra
                    bets for free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="game">
          <div className="container">
            <div className="game-rules">
              <div className="flex-game">
                <img src="img/crushed-btc.png" alt="Bitcoin" />
                <div className="game-title">Game Rules</div>
              </div>
            </div>
            <div className="note">
              <span className="impressive">Introduction:</span>
              Welcome to the Project PlayHalving, created on Solana as a fully
              decentralized game, offers a community-driven gaming experience
              where precision and timing can turn predictions into rewards.
              Operated entirely through a transparent smart contract available
              on GitHub, this game exemplifies the principles of blockchain
              technology, ensuring fairness, transparency, and security. Once
              you place your halving time, your tokens are securely held in the
              smart contract, which autonomously executes reward distribution
              based on accurate Bitcoin halving blockchain records. There are no
              central authorities or overseers; the smart contract rules
              supreme.
              <br />
              <br />
              <span className="impressive">Gameplay Rules:</span>
              <br />
              <br />
              <span className="impressive">Getting Started:</span> Connect your
              digital wallet to receive a game ticket worth 5 USDC, utilizing
              the Solana network for transactions.
              <br />
              <span className="impressive">Making Your Prediction:</span> Set
              your prediction for the exact date and time of the next Bitcoin
              Halving event in the format of DD:MM:HH:MM:SS. Precision is key,
              as general guesses will not qualify for rewards.
              <br />
              <br />
              <span className="impressive">Precision Pays:</span>
              <br />
              <br />
              <span className="impressive">Exact Minute:</span> If your
              prediction nails the exact minute of the Halving, you'll earn a
              reward worth 20% of your ticket's value in USDC.
              <br />
              <span className="impressive">Exact Second:</span> Pinpointing the
              exact second increases your reward to 50% of the ticket's value in
              USDC.
              <br />
              <span className="impressive">Millisecond Mastery:</span> Guessing
              the precise time down to the millisecond places you among the
              elite winners. The prize pool will be evenly split among all
              participants who achieve this feat.
              <br />
              <br />
              <span className="impressive">Claiming Rewards:</span> Winners must
              claim their USDC rewards on the website no later than 72 hours
              post Bitcoin Halving. Unclaimed rewards will be automatically
              transferred to the smart contract creator as per the decentralized
              governance model.
            </div>
            <div className="prizes">
              <div className="first-frame">
                <img src="img/usdc.png" alt="" />
                <span>
                  Win 1000,000 USDT by precisely predicting the exact date and
                  time, down to the millisecond, of the upcoming Bitcoin
                  halving!
                </span>
              </div>
              <div className="second-frame">
                <img src="img/trophy.png" alt="" />
                <span>
                  The moment the Bitcoin halving occurs, we’ll determine the
                  winner based on who made the earliest correct prediction.
                </span>
              </div>
              <div className="third-frame">
                <img
                  style={{ top: -35, maxWidth: 160 }}
                  src="img/blue-ticket.png"
                  alt=""
                />
                <span>
                  If you correctly predict the date, hour, minute, and
                  second,you’ll be rewarded with a refund of 50% of the ticket’s
                  value in USDT.
                </span>
              </div>
              <div className="fourth-frame">
                <img
                  style={{ top: -45, maxWidth: 93 }}
                  src="img/half.png"
                  alt=""
                />
                <span>
                  If you correctly predict the date, hour, minute, and
                  second,you’ll be rewarded with a refund of 20% of the ticket’s
                  value in USDT.
                </span>
              </div>
            </div>
          </div>
        </div>
        <LiveStats />
        <div className="container">
          <div className="footer-purple">
            <div className="text-footer">
              © Project PlayHalving.com All Rights reserved 2024 Responsable
              Gambling (pop-up cu textul pe care ti l-am dat aseara intr-un
              design nice simplu de tot la fel ca wallet connect) LOGO si link
              TELEGRAM / TWITTER / GITHUB
            </div>
            <img
              style={{ maxWidth: 170, borderRadius: "0 24px 24px 0" }}
              src="img/footer-bitcoin.png"
              alt="Bitcoin mining"
            />
          </div>
        </div>
        <div className="container">
          <div className="row footer-important">
            <div className="col-xl-7 col-md-12">
              <div className="important">
                playhalving.com is licensed and regulated by the Government of
                the Autonomous Island of Anjouan, Union of Comoros and operates
                under License No. ALSI-062403015-F16. playhalving.com has passed
                all regulatory compliance and is legally authorised to conduct
                gaming operations for any and all games of chance and wagering.
                <br />
                <br />© playhalving 2024
              </div>
            </div>
            <div className="col-xl-5 col-md-12">
              <div className="important">
                playhalving.com is owned and operated by ChipFling Limited.
                registration number: ALSI-062403015-F16,
                <br />
                <br />
                Registered address: Autonomous Island of Anjouan.
                <br />
                <br />
                Contact us hello@playhalving.com.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="header-flex">
                <div className="you-have">
                  Tickets acquired <span className="blue-bbl">150</span>
                </div>
                <div className="you-have">
                  Chance
                  <span
                    style={{ backgroundColor: "#a95aff" }}
                    className="blue-bbl"
                  >
                    25%
                  </span>
                </div>
                <div className="you-have">
                  Available Bets
                  <span
                    style={{ backgroundColor: "#9562ff" }}
                    className="blue-bbl"
                  >
                    15
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="img/cross%201.svg" alt="" />
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="flex-wallet">
                <img
                  style={{ maxWidth: "327px" }}
                  src="img/left-wallet.png"
                  alt=""
                />
                <div className="modal-cnt-wallets">
                  <div className="block-last">
                    <div className="connect-wallet-modal">
                      <div className="connect">Connect Wallet</div>
                      <div className="us">
                        Select your wallet to connect with us
                      </div>
                    </div>
                    <div className="crypto-cnt">
                      <div className="crypto">
                        <div className="crypto-text">
                          <img src="img/Ethereumdisabled.png" alt="" />
                          <span>Ethereum</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/Metamask.png" alt="" />
                          <span>Metamask</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/Coinbase.png" alt="" />
                          <span>Coinbase</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/Ethereum.png" alt="" />
                          <span>Ethereum</span>
                        </div>
                      </div>
                      <div className="crypto" style={{ paddingTop: 44 }}>
                        <div className="crypto-text">
                          <img src="img/Safepal.png" alt="" />
                          <span>Safepal</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/Brave.png" alt="" />
                          <span>Brave</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/Blocto.png" alt="" />
                          <span>Blocto</span>
                        </div>
                        <div className="crypto-text">
                          <img src="img/opera.png" alt="" />
                          <span>Opera</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="">
                    <div className="view-more">View More</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
