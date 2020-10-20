const nullArgToUn = (args: object, except?: string[]): object => {
    const notNull = {};
    Object.keys(args).forEach(key => {
        let pass = false;
        if(except)
          pass = except.some(ex => ex == key)
        if(pass) return;

        if (args[key] == null || args[key] == undefined) {
            notNull[key] = undefined;
        }else{
            notNull[key] = args[key]
        }
        });
        return notNull;
  };
  
  export default nullArgToUn;
  