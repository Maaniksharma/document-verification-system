import { useEffect, useState } from "react";

function useTriggerEffect(triggerValue: boolean, callback: () => void) {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    callback();
  }, [triggerValue]);
}

export default useTriggerEffect;
