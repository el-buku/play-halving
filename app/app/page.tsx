import Image from "next/image";
import {
  WalletDisconnectButtonDynamic,
  WalletMultiButtonDynamic,
} from "@/components/wallet-multi-button";

import React from "react";
//@ts-ignore
import HTMLRenderer from "react-html-renderer";

const slobozStr = `<div class="guess-container">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:ital,wght@0,100;0,300;0,400;0,500;1,100&family=Press+Start+2P&family=Source+Code+Pro:wght@500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"/>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet"/>

<div class="prog-cnt">
    <div class="container">
        <div class="slidecontainer">
            <input type="range" min="1" max="100" value="50" style="position: relative" class="slider" id="myRange">
            <div class="tool" id="tooltip" style="display: none;">
                <span id="demo">50</span>Minimum tickets Left To Execute The Draw</div>
        </div>
    </div>
</div>
<div class="guess">
    <div class="container">
        <div class="guess-title">
            Guess The Exact Date And Time For Bitcoin Halving And Win <span style="color: #ff8c00;">100,000</span> USDT
        </div>
        <div class="flex-btc">
            <div class="btc-1"><img src="img/BTC1.png" alt=""></div>
            <div class="btc-2"><img src="img/BTC2.png" alt=""></div>
            <div class="btc-4"><img src="img/BTC4.png" alt=""></div>
            <div class="btc-5"><img src="img/BTC5.png" alt=""></div>
            <div class="stone-2"><img src="img/stone2.png" alt=""></div>
            <div class="stone-3"><img src="img/stone3.png" alt=""></div>
            <div class="hammer"><img src="img/hammer.png" alt=""></div>
            <img class="btc-img" src="img/big.png" alt="Mining bitcoins image for casino lottery.">
        </div>
        <div class="mobile-btc d-none"><img src="img/bitcoins.png" alt=""></div>
        <div class="count-down-card">
            <div class="count-down-first-section">
                <div class="you-have">
                    You have <span class="blue-bbl">12 Chance</span> Of <span class="purple-bets">15 Bets</span>
                </div>
                <div class="guess-number">
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">Months</span>
                    </div>
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">Days</span>
                    </div>
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">Hours</span>
                    </div>
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">Minutes</span>
                        <img src="img/20.png" alt="Get 20% back">
                    </div>
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">Seconds</span>
                        <img src="img/50.png" alt="Get 50% back">
                    </div>
                    <div class="count-down">
                        <input type="number" placeholder="?">
                        <span class="month">M.Secs</span>
                        <img style="right: 0;" src="img/usdt.png" alt="Get big prize 100k USDT">
                    </div>
                </div>
            </div>
            <div class="count-down-last-section">
                <button class="green-ticket">Get 1 Ticket For 5.00 USDT</button>
                <div class="flex-purple-tickets">
                    <div class="purple-ticket">
                        <img src="img/purple-tiket.png" alt="">
                        <span>Buy 2 tickets</span>
                    </div>
                    <div class="purple-ticket">
                        <img src="img/purple-tiket.png" alt="">
                        <span>Buy 5 tickets</span>
                    </div>
                    <div class="purple-ticket">
                        <img src="img/purple-tiket.png" alt="">
                        <span>Buy 10 tickets</span>
                    </div>
                    <div class="purple-ticket">
                        <img src="img/purple-tiket.png" alt="">
                        <span>Buy 15 tickets</span>
                    </div>
                </div>
                <div class="last-info">
                    <img src="img/fi-rr-info.svg" alt="">
                    <span class="last-purple-text">For Each 5 played tickets accquired you will receive 3 extra bets for free</span>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="game">
    <div class="container">
        <div class="game-rules">
            <img src="img/crushed-btc.png" alt="Bitcoin">
            <div class="flex-game">
                <div class="game-title">Game Rules</div>
                <div class="note">Please note: Each entry is represented by a unique NFT, which you can claim</div>
            </div>
        </div>
        <div class="prizes">
            <div class="first-frame">
                <img src="img/thron.png" alt="">
                <span>Win 1000,000 USDT by precisely predicting
                the exact date and time, down to the millisecond, of the upcoming
                Bitcoin halving!</span>
            </div>
            <div class="second-frame">
                <img src="img/trophy.png" alt="">
                <span>The moment the Bitcoin halving occurs, we’ll determine the winner based on who made the earliest correct prediction.</span>
            </div>
            <div class="third-frame">
                <img style="top: -50px; max-width: 60px;" src="img/hand.png" alt="">
                <span>If you correctly predict the date, hour, minute, and second, you’ll be rewarded with a refund of 50% of the ticket’s value in USDT.</span>
            </div>
            <div class="fourth-frame">
                <img style="top: -35px; max-width: 160px;" src="img/blue-ticket.png" alt="">
                <span>Guessing the correct date, hour, and minute earns you 25% of the ticket’s value back.</span>
            </div>
        </div>
    </div>
</div>
<div class="live">
    <div class="container">
        <div class="live-frame">
            <div class="live-banner">
                <div class="live-stats">Live Stats</div>
                <img style="max-width: 80px;" src="img/live.png" alt="Live rec img">
            </div>
            <img style="max-width: 317px;" src="img/diamonds-btc.png" alt="">
        </div>
        <div style="overflow-x:auto;">
            <table class="w-100">
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
                    <td style="display: flex; justify-content: center;">
                        <div class="white-pill">
                            <img src="img/purple-tiket.png" alt="">
                            <span>10</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1Kf28gYz9WUzvxE8H7XVb3s6iZpN2q5coA</td>
                    <td>12th Apr, 2024 at 6:22 PM</td>
                    <td>TX12265489965479</td>
                    <td style="display: flex; justify-content: center;">
                        <div class="white-pill">
                            <img src="img/purple-tiket.png" alt="">
                            <span>10</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1Kf28gYz9WUzvxE8H7XVb3s6iZpN2q5coA</td>
                    <td>12th Apr, 2024 at 6:22 PM</td>
                    <td>TX12265489965479</td>
                    <td style="display: flex; justify-content: center;">
                        <div class="white-pill">
                            <img src="img/purple-tiket.png" alt="">
                            <span>10</span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
<div class="container">
    <div class="footer-purple">
        <div class="text-footer">DISCLIMER:<br>As the Bitcoin having will not return the millisecond of
            the halving this will be randomly extracted</div>
        <img style="max-width: 170px; border-radius: 0 24px 24px 0;" src="img/footer-bitcoin.png" alt="Bitcoin mining">
    </div>
</div>
</div>`;
export default function Home() {
  return <body dangerouslySetInnerHTML={{ __html: slobozStr }}></body>;
}
