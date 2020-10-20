import Place from "../../../entities/Place";
import { AddPlaceMutationArgs, AddPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import Whichi from "../../../entities/Whichi";

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: privateResolver(
      async (
        _,
        args: AddPlaceMutationArgs,
        { req }
      ): Promise<AddPlaceResponse> => {
        //const user: User = req.user;
        try {
          const {lat, lng, imei, course, speed, utc, poll, raw } = args;
          let place = await Place.create({
            lat,
            lng,
            imei: imei==null || imei==undefined? undefined : imei,
            course: course==null || course==undefined? undefined : course,
            speed: speed==null || speed == undefined? undefined : speed,
            utc: utc? new Date(utc): undefined
          }).save();

          let message = await Message.create({
            raw_content: raw==null || raw == undefined? undefined : raw,
            txrx: "rx",
            kind: poll==null || poll == undefined? "place_ask" : "place_poll"
            
          })
          message.place = place;
         
          await message.save();

          let whichi = await Whichi.findOne({where: {imei: imei}})
          if(whichi){
            whichi.placeUpdatedAt = place.createdAt;
            whichi.last_position = place;
            await whichi.save();
          }

        

          //User.create({ ...args }).save();
          
        
          return {
            ok: true,
            error: null
          };
          
        } catch (error) {

          return {
            ok: false,
            error: error.message
          };

        }
      }
    )
  }
};

export default resolvers;
