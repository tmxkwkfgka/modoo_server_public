const nullArgToUn = (args: string | null): string | undefined => {
    if(args == undefined || args == null)
        return undefined;

    return args;
    
  };
  
  export default nullArgToUn;
  