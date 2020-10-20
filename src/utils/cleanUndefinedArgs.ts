const cleanUndefinedArgs = (args: object, exceptKeys: String[]): object => {
    const notUndefined = {};
    Object.keys(args).forEach(key => {
      if (args[key] !== undefined && !exceptKeys.includes(key)) {
        notUndefined[key] = args[key];
      }
    });
    return notUndefined;
  };
  
  export default cleanUndefinedArgs;
  