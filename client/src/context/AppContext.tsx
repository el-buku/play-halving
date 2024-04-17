// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  type Wallet,
} from "@solana/wallet-adapter-react";
import {
  WalletIcon,
  WalletModal,
  WalletModalContext,
  WalletModalProvider,
  useWalletModal,
  type WalletModalProps,
} from "@solana/wallet-adapter-react-ui";

//TODO
// import {
//   UnsafeBurnerWalletAdapter,
//   WalletConnectWalletAdapter,
// } from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl } from "@solana/web3.js";
// import "@solana/wallet-adapter-react-ui/styles.css";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
// import { ProgramContextProvider } from "./ProgramContext";
import { endpoint, network, wallets } from "../constants";
import { createPortal } from "react-dom";
import { WalletReadyState, type WalletName } from "@solana/wallet-adapter-base";
function truncateMiddle(str: string, maxLength: number = 12) {
  if (str.length <= maxLength) {
    return str;
  }

  var start = Math.ceil(maxLength / 2);
  var end = Math.floor(maxLength / 2);
  return str.slice(0, start) + " ... " + str.slice(-end);
}
export function AppContext({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          {/* <ProgramContextProvider>{children}</ProgramContextProvider> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
function splitArrayIntoChunks(array: any[], chunkSize: number) {
  let chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
export const WalletButtonEntry: FC<WalletModalProps> = ({
  container = "body",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    wallets,
    select,
    connected,
    connecting,
    disconnect,
    wallet: connectedWallet,
  } = useWallet();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [portal, setPortal] = useState<Element | null>(null);

  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notInstalled: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      } else {
        notInstalled.push(wallet);
      }
    }

    return installed.length ? [installed, notInstalled] : [notInstalled, []];
  }, [wallets]);

  const hideModal = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => setVisible(false), 150);
  }, [setVisible]);

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      hideModal();
    },
    [hideModal]
  );

  const handleWalletClick = useCallback(
    (event: any, walletName: WalletName) => {
      console.log({ walletName, event });
      select(walletName);
      handleClose(event);
    },
    [select, handleClose]
  );

  const handleCollapseClick = useCallback(
    () => setExpanded(!expanded),
    [expanded]
  );

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const node = ref.current;
      if (!node) return;

      // here we query all focusable elements
      const focusableElements = node.querySelectorAll("button");
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstElement = focusableElements[0]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey) {
        // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    },
    [ref]
  );

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideModal();
      } else if (event.key === "Tab") {
        handleTabKey(event);
      }
    };

    // Get original overflow
    const { overflow } = window.getComputedStyle(document.body);
    // Hack to enable fade in animation after mount
    setTimeout(() => setFadeIn(true), 0);
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Listen for keydown events
    window.addEventListener("keydown", handleKeyDown, false);

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [hideModal, handleTabKey]);

  useLayoutEffect(
    () => setPortal(document.querySelector(container)),
    [container]
  );
  console.log({ visible });
  const addr = connectedWallet?.adapter.publicKey?.toString() || "";
  const [displayText, setDisplayText] = useState(truncateMiddle(addr));
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseOver = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    connected && setDisplayText("Disconnect Wallet");
  };

  const handleMouseOut = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    if (connected) {
      const id = setTimeout(() => setDisplayText(truncateMiddle(addr)), 1000);
      setTimeoutId(id);
    }
  };

  return (
    <>
      <button
        // disabled={
        //   buttonState === "connecting" || buttonState === "disconnecting"
        // }
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={() => (!connected ? setVisible(!visible) : disconnect())}
        type="button"
        className="connect-wallet"
        style={{ width: 300, justifyContent: "center" }}
      >
        {!connected && <img src="img/fi-rr-plug.svg" alt="" />}
        <span>
          {!connected && !connecting
            ? "Connect Wallet"
            : connected && !connecting
            ? displayText
            : connecting
            ? "Connecting..."
            : "Connected"}
        </span>
      </button>
      {/* {visible && <ExampleModal visible={visible} setVisible={setVisible} />} */}
      {
        <div
          // className="fade show"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 10,
            transition: visible ? "opacity 1s" : "opacity 0.3s",
            opacity: visible ? 1 : 0, // set opacity property to 1, completely visible
            /* bring your own prefixes */
            transform: "translate(-50%, -50%)",
          }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                {/* <div className="header-flex">
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
                </div> */}
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setVisible(false);
                  }}
                  style={{ marginBottom: 0 }}
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
                    <div className="connect-wallet-modal">
                      <div className="connect">Connect Wallet</div>
                      <div className="us">
                        {listedWallets.length
                          ? "Select your wallet to connect with us"
                          : "You'll need a Solana wallet to continue"}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px",
                      }}
                    >
                      {listedWallets.concat(collapsedWallets).map((w, i) => {
                        return (
                          <div
                            className="crypto"
                            style={{
                              paddingBottom: 10,
                              cursor: "pointer",
                              height: "auto",
                              justifyContent: "center",
                            }}
                            onClick={(event) =>
                              handleWalletClick(event, w.adapter.name)
                            }
                          >
                            <div className="crypto-text">
                              <img
                                src={w.adapter.icon}
                                alt={`${w.adapter.name} icon`}
                                style={{
                                  width: "100%",
                                  aspectRatio: "1/1",
                                  objectFit: "cover",
                                }}
                              />
                              <span>{w.adapter.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* {console.log(splitArrayIntoChunks(listedWallets, 4))} */}
                    {/* {splitArrayIntoChunks(listedWallets, 4).map(
                        (walletRow) => {
                          console.log({ walletRow });
                          return (
                            <div className="crypto-cnt">
                              {walletRow.map((w, i) => {
                                console.log(w);
                                return (
                                  <>
                                    <div className="crypto">
                                      <div className="crypto-text">
                                        <img
                                          src="img/Ethereumdisabled.png"
                                          alt=""
                                        />
                                        <span>Ethereum</span>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          );
                        }
                      )} */}
                    {/* {listedWallets.length ? (
                            <>
                                <h1 className="wallet-adapter-modal-title">Connect a wallet on Solana to continue</h1>
                                <ul className="wallet-adapter-modal-list">
                                    {listedWallets.map((wallet) => (
                                        <WalletListItem
                                            key={wallet.adapter.name}
                                            handleClick={(event) => handleWalletClick(event, wallet.adapter.name)}
                                            wallet={wallet}
                                        />
                                    ))}
                                    {collapsedWallets.length ? (
                                        <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
                                            {collapsedWallets.map((wallet) => (
                                                <WalletListItem
                                                    key={wallet.adapter.name}
                                                    handleClick={(event) =>
                                                        handleWalletClick(event, wallet.adapter.name)
                                                    }
                                                    tabIndex={expanded ? 0 : -1}
                                                    wallet={wallet}
                                                />
                                            ))}
                                        </Collapse>
                                    ) : null}
                                </ul>
                                {collapsedWallets.length ? (
                                    <button
                                        className="wallet-adapter-modal-list-more"
                                        onClick={handleCollapseClick}
                                        tabIndex={0}
                                    >
                                        <span>{expanded ? 'Less ' : 'More '}options</span>
                                        <svg
                                            width="13"
                                            height="7"
                                            viewBox="0 0 13 7"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`${
                                                expanded ? 'wallet-adapter-modal-list-more-icon-rotate' : ''
                                            }`}
                                        >
                                            <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                                        </svg>
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <h1 className="wallet-adapter-modal-title">
                                    You'll need a wallet on Solana to continue
                                </h1>
                                <div className="wallet-adapter-modal-middle">
                                    <WalletSVG />
                                </div>
                                {collapsedWallets.length ? (
                                    <>
                                        <button
                                            className="wallet-adapter-modal-list-more"
                                            onClick={handleCollapseClick}
                                            tabIndex={0}
                                        >
                                            <span>{expanded ? 'Hide ' : 'Already have a wallet? View '}options</span>
                                            <svg
                                                width="13"
                                                height="7"
                                                viewBox="0 0 13 7"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`${
                                                    expanded ? 'wallet-adapter-modal-list-more-icon-rotate' : ''
                                                }`}
                                            >
                                                <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                                            </svg>
                                        </button>
                                        <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
                                            <ul className="wallet-adapter-modal-list">
                                                {collapsedWallets.map((wallet) => (
                                                    <WalletListItem
                                                        key={wallet.adapter.name}
                                                        handleClick={(event) =>
                                                            handleWalletClick(event, wallet.adapter.name)
                                                        }
                                                        tabIndex={expanded ? 0 : -1}
                                                        wallet={wallet}
                                                    />
                                                ))}
                                            </ul>
                                        </Collapse>
                                    </>
                                ) : null}
                            </>
                        )} */}

                    {/* <div className="crypto-cnt">
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
                        <div className="crypto" style={{ paddingTop: "44px" }}>
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
                      </div> */}
                    {/* <a href="#">
                      <div className="view-more">View More</div>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export const WalletModalButton = () => {
  return (
    <AppContext>
      <WalletButtonEntry container="#walletModal" />
    </AppContext>
  );
};
