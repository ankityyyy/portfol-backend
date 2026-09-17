const sessions = new Map();

export function getHistory(user_id) {
  if (!sessions.has(user_id)) {
    sessions.set(user_id, []);
  }
  return sessions.get(user_id);
}

export const addData=(user_id,role,message)=>{
   let history=getHistory(user_id);

    history.push({role,message})

    if(history.length>6){
     history.shift();
    }
   
}

