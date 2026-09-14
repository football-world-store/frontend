import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants";
import { customersService } from "@/services";

export const useCustomerBirthdaysQuery = (daysAhead?: number) =>
  useQuery({
    queryKey: queryKeys.customers.birthdays(daysAhead),
    queryFn: () => customersService.birthdays(daysAhead),
  });
