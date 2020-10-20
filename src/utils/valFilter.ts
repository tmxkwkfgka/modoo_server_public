const valFilter = (args: undefined | null | string): undefined | string => {
   if(args == null || undefined)
    return undefined;
   else
    return args;
  };
  
  export default valFilter;
  