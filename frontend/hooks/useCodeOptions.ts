import { useEffect, useState } from "react";

import { CodeOption, fetchCodeOptions } from "@/api/codes.client";

export function useCodeOptions(codeType: string): CodeOption[] {
  const [options, setOptions] = useState<CodeOption[]>([]);

  useEffect(() => {
    fetchCodeOptions(codeType).then(setOptions);
  }, [codeType]);

  return options;
}
