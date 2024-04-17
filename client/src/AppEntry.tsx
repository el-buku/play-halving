import { Slider } from "./components/Slider";
import { WalletButtonEntry } from "./components/WalletButton";
import { AppContext } from "./context";

export const AppEntry = () => {
  return (
    <AppContext>
      <Slider container="#sliderContainer" />
      <WalletButtonEntry container="#walletButton" />
    </AppContext>
  );
};
