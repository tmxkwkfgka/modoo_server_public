
import { AddRxReportMutationArgs, AddRxReportResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import Message from "../../../entities/Message";
import {parseRxReportSetting} from "../../../utils/parseHex"
import { RxReportSettingObj } from "../../../types/types"
import Report_Setting from "../../../entities/Report_Setting";

const resolvers: Resolvers = {
  Mutation: {
    AddRxReport: privateResolver(
      async (
        _,
        args: AddRxReportMutationArgs,
        { req }
      ): Promise<AddRxReportResponse> => {
        //const user: User = req.user;
        try {
          const { start, raw_content} = args;
          let resultObj: RxReportSettingObj = parseRxReportSetting(start, raw_content);

          if(!resultObj){
            return {
              ok: false,
              error: "parse Error"
            };
          }else{

            let message = await Message.create({
              raw_content,
              kind: "report_rx_ask",
              txrx: "rx",
            }).save();
            let reports : Array<Report_Setting> = [];
            resultObj.info.reports.forEach((report)=>{

              let r = Report_Setting.create({
                report_number: report.report_num,
                utc_on: report.utcOn? true : false,
                gps_on: report.gpsOn? true : false,
                alt_on: report.altOn? true : false,
                speed_on: report.speedOn? true: false,
                course_on: report.courseOn? true: false,
                period_time: report.periodTime,
              

              })
              reports.push(r);
         
            })
            
            if(reports.length > 0){
              reports.forEach(r=>message.reports.push(r))
              await message.save();
            }else{
              return {
                ok: false,
                error: "No reports"
              };
            }
            
            
            
            return {
              ok: true,
              error: null
            };

          }
          
        } catch (error) {

          return {
            ok: false,
            error: error.message
          };

        }
        // return {
        //   ok:true,
        //   error: null
        // }
      }
    )
  }
};

export default resolvers;
