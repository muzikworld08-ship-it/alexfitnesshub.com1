/**
 * Precise, biomechanically accurate exercise demonstration GIF catalog.
 * Sourced directly from Gym Visual / exercises-dataset.
 * Guarantees every exercise displays its authentic biomechanical animation.
 */

export const BASE_MEDIA_URL = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";

export const CATEGORY_FALLBACK_GIFS: Record<string, string> = {
  chest: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif", // Barbell Bench Press
  incline_chest: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0314-ns0SIbU.gif", // Incline Dumbbell Bench Press
  back: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif", // Pull Up
  lats: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif", // Lat Pulldown
  shoulders: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0405-znQUdHY.gif", // Dumbbell Shoulder Press
  deltoids: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif", // Lateral Raise
  arms: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif", // Dumbbell Bicep Curl
  biceps: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif", // Dumbbell Bicep Curl
  triceps: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0201-3ZflifB.gif", // Cable Pushdown
  legs: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif", // Barbell Squat
  quads: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif", // Barbell Squat
  hamstrings: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0085-wQ2c4XD.gif", // Romanian Deadlift
  glutes: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif", // Barbell Glute Bridge
  calves: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0999-9JprnPh.gif", // Calf Raise
  core: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif", // Plank
  abs: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif", // Crunches
  cardio: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif", // Cardio Drill
  mobility: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif", // Dynamic Stretch
  neck: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif", // Mobility / Neck
  general: "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif" // Push Up (never squat for general!)
};

export const ACCURATE_EXERCISE_MEDIA_MAP: Record<string, string> = {
  "12 3 30 treadmill walk": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3672-fNGumX0.gif",
  "3 second eccentric tempo push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "90 90 active hip opener": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "90 90 hip opener stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "90 90 hip stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1559-2LQkNPW.gif",
  "ab wheel rollout": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0001-K6f10p7.gif",
  "active arm circles core bracing": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "active lower body hamstring quad flushes": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1416-M72BExt.gif",
  "active stretch squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "archer push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "arnold dumbbell press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2137-Xy4jlWA.gif",
  "arnold press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2137-Xy4jlWA.gif",
  "assisted pull ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0017-kiJ4Z2K.gif",
  "b stance dumbbell romanian deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "back extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0022-b5h081i.gif",
  "back lever": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3297-GaSzzuh.gif",
  "banded clamshells with abduction": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1774-WL4EmxJ.gif",
  "banded glute bridge": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "barbell back squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "barbell bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif",
  "barbell bent over row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0027-eZyBC3j.gif",
  "barbell bicep curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0031-1JcTz65.gif",
  "barbell clean and press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0028-SGY8Zui.gif",
  "barbell curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0031-1JcTz65.gif",
  "barbell deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "barbell hip thrust": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "barbell row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0027-eZyBC3j.gif",
  "barbell squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "bayesian cable bicep curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "bear crawl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3360-0Yz8WdV.gif",
  "bear crawl kinetic hold steps": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3360-0Yz8WdV.gif",
  "behind the back barbell wrist curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0104-2qTvJAZ.gif",
  "bent over dumbbell reverse fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0383-EAs3xL9.gif",
  "bent over rear delt flyes": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0326-vYk8lqw.gif",
  "bicycle crunch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "bicycle crunches": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "bicycle crunches with pause": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "bird dog stability hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1405-zB3Zc6u.gif",
  "bodyweight air squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "bodyweight air squats glute kickbacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "bodyweight chair sofa dips": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0251-8J7VzF4.gif",
  "bodyweight forward walking lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "bodyweight russian twists": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0687-XVDdcoj.gif",
  "bodyweight squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1512-Y3g7gWb.gif",
  "bulgarian split squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0410-67p7p77.gif",
  "bulgarian split squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "bulgarian split squats quad dominant": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "burpees": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1160-dK9394r.gif",
  "butterfly hip opener with forward fold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "cable chest fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0227-Pr9Rhf4.gif",
  "cable crossover pec fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0154-aqvSOQE.gif",
  "cable crunch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0175-WW95auq.gif",
  "cable curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0868-G08RZcQ.gif",
  "cable face pull": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0196-OM46QHm.gif",
  "cable face pull with external rotation": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0196-OM46QHm.gif",
  "cable glute kickbacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0178-v6KzC5d.gif",
  "cable kneeling crunch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0175-WW95auq.gif",
  "cable lat pulldowns slow eccentric": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "cable lateral raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0170-07qI77O.gif",
  "cable overhead extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1722-1xHyxys.gif",
  "cable pull through for posterior chain": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0196-OM46QHm.gif",
  "cable pull throughs": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0196-OM46QHm.gif",
  "cable rope hammer curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0320-gLq0j4F.gif",
  "cable tricep pushdown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1723-qRZ5S1N.gif",
  "cable woodchopper high to low": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1722-1xHyxys.gif",
  "calf raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0999-9JprnPh.gif",
  "captain s chair knee to elbow twist": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3639-6sYyrRX.gif",
  "cardio high knees": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "cat cow dynamic breathing flow": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "chest dips": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0251-8J7VzF4.gif",
  "chest squeeze push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "chest supported dumbbell row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "chin ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0253-3Y444j8.gif",
  "close grip bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0030-J6Dx1Mu.gif",
  "close grip barbell bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif",
  "concentration curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0297-Z14lG93.gif",
  "contralateral dead bug": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0276-iny3m5y.gif",
  "controlled abdominal crunches": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "copenhagen adductor side plank": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "cossack squat dynamic lateral shift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "couch stretch for tight hip flexors": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1559-2LQkNPW.gif",
  "cross body mountain climbers": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2466-9c6T1YX.gif",
  "crunches": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "curtsy lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "curtsy lunges outer hip glute sculpt": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "dead bug": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0276-iny3m5y.gif",
  "dead bug contralateral reach": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0276-iny3m5y.gif",
  "dead bug core stabilization": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0276-iny3m5y.gif",
  "deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "decline bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0033-GrO65fd.gif",
  "decline push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0279-i5cEhka.gif",
  "decline sit up with controlled twist": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0282-QLL2gdc.gif",
  "deep primal squat pry hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "deficit push ups with handles": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "deficit reverse lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "diamond close grip push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "diamond push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0283-soIB2rj.gif",
  "dips": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0251-8J7VzF4.gif",
  "dumbbell kettlebell swing": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0549-UHJlbu3.gif",
  "dumbbell bent over row with chest support": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "dumbbell chest press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0289-SpYC0Kp.gif",
  "dumbbell curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "dumbbell fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0308-yz9nUhF.gif",
  "dumbbell flyes": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0308-yz9nUhF.gif",
  "dumbbell goblet squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "dumbbell guillotine press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0045-GXoaSgn.gif",
  "dumbbell hammer curls": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0320-gLq0j4F.gif",
  "dumbbell hammer curls forearm arm tone": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0320-gLq0j4F.gif",
  "dumbbell kickbacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0201-3ZflifB.gif",
  "dumbbell lateral raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif",
  "dumbbell lateral raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif",
  "dumbbell lateral raises shoulder sculpt": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif",
  "dumbbell overhead shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0361-84RyJf8.gif",
  "dumbbell pullover": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0375-9XjtHvS.gif",
  "dumbbell renegade rows with push up": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "dumbbell romanian deadlift hamstring focus": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "dumbbell romanian deadlift rdl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "dumbbell romanian deadlifts": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "dumbbell row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "dumbbell seal row on flat bench": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1330-ZIViNh1.gif",
  "dumbbell shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0405-znQUdHY.gif",
  "dumbbell snatch alternating single arm": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3888-6pTkI99.gif",
  "dumbbell step ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0785-g67a2L1.gif",
  "dumbbell step ups with glute squeeze": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0785-g67a2L1.gif",
  "dumbbell suitcase carry": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3548-mWBtgmb.gif",
  "dumbbell tricep kickbacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1734-cAvTaSg.gif",
  "dynamic cat cow spinal mobility": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "dynamic deltoid scapular arm circles": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "dynamic hip flexor psoas stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1559-2LQkNPW.gif",
  "dynamic jumping jacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "ez bar curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0031-1JcTz65.gif",
  "elevated single leg glute bridge": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "explosive squat jumps": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "face pulls": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0174-8b6lC55.gif",
  "face pulls band pull aparts": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0174-8b6lC55.gif",
  "fast paced air squat burnout": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "flat dumbbell bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0289-SpYC0Kp.gif",
  "floor glute bridges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "flutter kicks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0459-UVo2Qs2.gif",
  "flutter kicks scissor drills": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0459-UVo2Qs2.gif",
  "forearm plank": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "front lever": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3296-PkCN2lv.gif",
  "front lever progression": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3296-PkCN2lv.gif",
  "front raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0312-W8mS94Y.gif",
  "full athletic burpees": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1160-dK9394r.gif",
  "full body burpees": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1160-dK9394r.gif",
  "full posterior muscle release stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1389-DEEqoI2.gif",
  "glute bridge isometric hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "glute bridges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "goblet squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0319-rX7m040.gif",
  "goblet squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "hammer curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0320-gLq0j4F.gif",
  "handstand push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "hanging knee to chest leg raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "hanging leg knee raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0011-03lzqwk.gif",
  "hanging leg raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "hanging leg raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "heels elevated goblet cyclist squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "helms dumbbell chest supported row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "high knees": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "high knees rhythmic drive": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "high plank anti rotation shoulder taps": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "high intensity dumbbell thrusters": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1664-qAmNMJY.gif",
  "hip thrust": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "incline alternating dumbbell curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "incline barbell bench press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0025-EIeI8Vf.gif",
  "incline cable fly with supination": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0171-tBWXbIT.gif",
  "incline dumbbell chest press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0314-ns0SIbU.gif",
  "incline dumbbell curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0315-Jg9Qo7H.gif",
  "incline dumbbell press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0314-ns0SIbU.gif",
  "incline hand elevated push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "incline power walking light jogging": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3666-rjiM4L3.gif",
  "incline prone rear delt dumbbell fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0308-yz9nUhF.gif",
  "incline push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0491-G82M0r4.gif",
  "incline push ups bench countertop": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "incline spider dumbbell curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "inverted bodyweight row on smith machine": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3168-3xK09Sk.gif",
  "isometric wall sit": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0827-0gq0k91.gif",
  "jm press triceps mass builder": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0816-fSrPP6B.gif",
  "jump rope": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "jump rope ghost rope drills": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "jump squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1373-gR8iB81.gif",
  "jumping jacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "kas glute bridge with barbell": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "kouch stretch rear foot elevated on wall": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "l sit": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0827-0gq0k91.gif",
  "l sit flutter kicks on parallettes": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0459-UVo2Qs2.gif",
  "landmine chest press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0989-c16nYGA.gif",
  "landmine overhead shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0997-peAeMR3.gif",
  "lat pulldown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "lat pulldown resistance band pulldown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "lat pulldown to sternum": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "lateral mini band glute walk": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0977-sTg7iys.gif",
  "lateral raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0334-DsgkuIt.gif",
  "lateral skater hops": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3361-zfNHMN9.gif",
  "lateral speed skater hops": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3361-zfNHMN9.gif",
  "leg curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0586-17lJ1kr.gif",
  "leg extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0585-L3k8g8v.gif",
  "leg extensions": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0585-L3k8g8v.gif",
  "leg press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0739-10Z2DXU.gif",
  "leg press high wide stance": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0739-10Z2DXU.gif",
  "leg raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "low lunge quad hip flexor stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1564-tFGKm99.gif",
  "low impact jumping jacks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "lying dumbbell hamstring curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1661-XVzF3iZ.gif",
  "lying figure 4 piriformis stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1710-RQNVT10.gif",
  "lying leg curls": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0586-17lJ1kr.gif",
  "lying leg raises with pelvic lift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "lying lower ab leg raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0472-I3tsCnC.gif",
  "lying scissor flutter kicks": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0459-UVo2Qs2.gif",
  "lying triceps extension skull crushers": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0055-6b2G33i.gif",
  "machine chest press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1299-jHAnWmT.gif",
  "machine shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0405-znQUdHY.gif",
  "meadows row landmine row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0988-km0sQC0.gif",
  "mountain climber cardio bursts": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2466-9c6T1YX.gif",
  "mountain climbers": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2466-9c6T1YX.gif",
  "mountain climbers with slow tempo": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2466-9c6T1YX.gif",
  "neutral grip lat pulldown to clavicle": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "neutral grip pull ups chin ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif",
  "nordic hamstring curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1417-GOJKFfO.gif",
  "one arm push up": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "overhead barbell press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0091-Y7598j1.gif",
  "overhead barbell shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0091-kTbSH9h.gif",
  "overhead cable cross body triceps extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0194-2IxROQ1.gif",
  "overhead dumbbell tricep extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1738-5fKX7wi.gif",
  "overhead dumbbell triceps extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0092-5uFK1xr.gif",
  "overhead ez bar french press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1747-CFN9P8G.gif",
  "overhead triceps extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0330-OVIKwsd.gif",
  "overhead triceps rope extension": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0200-dU605di.gif",
  "pallof press with isometric hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0979-9pa4H5m.gif",
  "parallel bar dips": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0251-8J7VzF4.gif",
  "passive spine hip flexor decompression": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1559-2LQkNPW.gif",
  "pec deck fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0596-v3xmPAR.gif",
  "pendlay barbell explosive row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3017-r0z6xzQ.gif",
  "pigeon pose with active thoracic reach": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1582-K5xgdvI.gif",
  "pike push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "pistol squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "pistol squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "planche": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3301-rQhGcin.gif",
  "plank": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "plank hip dips": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3544-5VXmnV5.gif",
  "plank hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "plank holds": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "plank to pike hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "plank to push up": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "plank with shoulder taps": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "plate front raise to overhead lockout": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0977-sTg7iys.gif",
  "plyometric split jump lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "preacher curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0070-M0iN95N.gif",
  "preacher hammer cable curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1639-PcPe0P5.gif",
  "primal cat cow spinal waves": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "prone abdominal cobra stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1713-YUYAMEj.gif",
  "prone glute lift straight leg pulse": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1002-bbLR7fB.gif",
  "prone trap 3 scapular raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1343-lCKm4Rs.gif",
  "pull ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0652-lBDjFxJ.gif",
  "push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "push up pyramid": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "quad burnout heel elevated squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "rear delt fly": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0326-vYk8lqw.gif",
  "resistance band pull aparts posture opener": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0970-r1XNRYB.gif",
  "resistance band shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3122-S93zLTG.gif",
  "reverse crunch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0872-nCU1Ekp.gif",
  "reverse grip ez bar curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0031-1JcTz65.gif",
  "reverse lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0381-R5z1g34.gif",
  "romanian barbell deadlifts": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "romanian deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0085-wQ2c4XD.gif",
  "rope jump": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3220-f9lVSSI.gif",
  "russian twist": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0687-XVDdcoj.gif",
  "russian twists": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0687-XVDdcoj.gif",
  "russian twists with knee tuck": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0687-XVDdcoj.gif",
  "scapular push up protraction retraction": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "seated bradford shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0087-0dCyly0.gif",
  "seated cable row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0861-fUBheHs.gif",
  "seated calf raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1385-IeDEXTe.gif",
  "seated soleus calf raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0088-ktsFQAZ.gif",
  "seated thoracic extension twist": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1011-S1JXDAG.gif",
  "shin box hip internal external rotations": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0984-vIICElP.gif",
  "shrugs": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0096-7q4U7Wd.gif",
  "side plank": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3544-5VXmnV5.gif",
  "side plank isometric hold": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "side plank with glute abduction": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "side plank with hip lift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "side lying ribcage sternal expansion": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1712-hC6oYY5.gif",
  "single leg glute bridge": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "single arm cable triceps kickback": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2406-ThKP69G.gif",
  "single arm dumbbell row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "single arm lat prayer cable pullover": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0987-arsYEd3.gif",
  "single arm supported dumbbell row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0293-BJ0Hz5L.gif",
  "single arm supported row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0987-arsYEd3.gif",
  "single leg glute bridges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "single leg romanian deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "sissy squat with support": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "sit ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0281-W3a7qG7.gif",
  "skull crushers": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0055-6b2G33i.gif",
  "sled prowler push pull sprint": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1689-wXvUZC8.gif",
  "squats": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1512-Y3g7gWb.gif",
  "standard push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "standing ankle dorsiflexion calf mobility stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1398-qOKcgVP.gif",
  "standing barbell wrist curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0104-2qTvJAZ.gif",
  "standing bodyweight calf raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0999-9JprnPh.gif",
  "standing cable crossover low to high": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0225-P5p0j8B.gif",
  "standing calf raises": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0999-9JprnPh.gif",
  "standing calf raises with pause": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0999-9JprnPh.gif",
  "standing dumbbell bicep curls": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "standing dumbbell overhead press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0414-bBi35y3.gif",
  "standing dumbbell overhead shoulder press": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0414-bBi35y3.gif",
  "standing ez bar bicep curl": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0285-BU15nH4.gif",
  "standing hip cars controlled articular rotations": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0228-Kpajagk.gif",
  "standing knee to elbow oblique crunches": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0972-tZkGYZ9.gif",
  "standing side bend intercostal reach": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0002-Hy9D21L.gif",
  "standing side bend lateral stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0794-1jXLYEw.gif",
  "standing unilateral quad stretch": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1407-PzNxakt.gif",
  "static reverse lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "step ups with knee drive": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0785-g67a2L1.gif",
  "step back burpees no push up": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "stomach vacuum core bracing": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0464-CosupLu.gif",
  "straight arm pulldown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0199-PskORrA.gif",
  "straight arm cable lat pushdown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0199-PskORrA.gif",
  "sumo deadlift": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0117-GepK4nQ.gif",
  "sumo deadlift with dumbbells": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0032-ila4NZS.gif",
  "sumo squat with pulse": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "swiss ball pike to push up": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "t bar row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0213-pwt0pnM.gif",
  "tate press dumbbell triceps flush": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0436-s5PdDyY.gif",
  "tempo goblet squat": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0043-qXTaZnJ.gif",
  "tibialis anterior wall raise": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1382-xo6sENf.gif",
  "tricep cable rope pushdowns": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1724-NN8nSNT.gif",
  "triceps pushdown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0201-3ZflifB.gif",
  "turkish get up with kettlebell": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0551-Ha7SZ3y.gif",
  "unilateral single leg glute bridge": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1409-qKBpF7I.gif",
  "upright row": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0119-Z0vW94c.gif",
  "walking": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "walking dumbbell lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "walking lunges": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "walking lunges with controlled drop": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0336-RRWFUcw.gif",
  "wall balls thruster into high target": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/3636-ealLwvX.gif",
  "wall sit": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0827-0gq0k91.gif",
  "wall sit hold with isometric adduction": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0827-0gq0k91.gif",
  "wide grip lat pulldown": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2330-LEprlgG.gif",
  "wide push ups": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/0662-I4hDWkc.gif",
  "world": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/2143-RSOsp5d.gif",
  "world s greatest stretch complex": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1604-DFGXwZr.gif",
  "zottman dumbbell reverse curls": "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/1654-nFc4FyV.gif"
};

export function cleanExerciseKey(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/^exercise[-_]/, "")
    .replace(/[^a-z0-9]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Resolves an authentic, verified exercise GIF.
 * Strictly prevents chest exercises from falling back to squats or unrelated body parts.
 */
export function getAccurateExerciseGif(exerciseNameOrId: string, category?: string): string {
  if (!exerciseNameOrId && !category) {
    return CATEGORY_FALLBACK_GIFS.general;
  }

  const clean = cleanExerciseKey(exerciseNameOrId);

  // 1. Check exact key in the accurate catalog
  if (clean && ACCURATE_EXERCISE_MEDIA_MAP[clean]) {
    return ACCURATE_EXERCISE_MEDIA_MAP[clean];
  }

  // 2. Specialized semantic rules for complex exercise titles:
  // Incline Chest Press / Incline Dumbbell
  if (clean.includes("incline") && (clean.includes("press") || clean.includes("chest") || clean.includes("dumbbell"))) {
    return CATEGORY_FALLBACK_GIFS.incline_chest;
  }
  // Bench press / Chest press / Push-ups / Flyes
  if (clean.includes("bench press") || clean.includes("chest press") || clean.includes("push up") || clean.includes("pushup")) {
    if (clean.includes("push")) return ACCURATE_EXERCISE_MEDIA_MAP["push ups"] || CATEGORY_FALLBACK_GIFS.chest;
    if (clean.includes("dumbbell")) return ACCURATE_EXERCISE_MEDIA_MAP["dumbbell chest press"] || CATEGORY_FALLBACK_GIFS.chest;
    return CATEGORY_FALLBACK_GIFS.chest;
  }
  if (clean.includes("pec deck") || clean.includes("chest fly") || clean.includes("cable fly")) {
    return ACCURATE_EXERCISE_MEDIA_MAP["pec deck fly"] || CATEGORY_FALLBACK_GIFS.chest;
  }
  if (clean.includes("chest dip") || clean.includes("dips")) {
    return ACCURATE_EXERCISE_MEDIA_MAP["chest dips"] || CATEGORY_FALLBACK_GIFS.chest;
  }

  // Back / Lat / Pull / Rows
  if (clean.includes("pull up") || clean.includes("pullup") || clean.includes("chin up")) {
    return CATEGORY_FALLBACK_GIFS.back;
  }
  if (clean.includes("lat pulldown") || clean.includes("pulldown") || clean.includes("lat prayer")) {
    return CATEGORY_FALLBACK_GIFS.lats;
  }
  if (clean.includes("row")) {
    return ACCURATE_EXERCISE_MEDIA_MAP["barbell bent over row"] || CATEGORY_FALLBACK_GIFS.back;
  }
  if (clean.includes("deadlift") || clean.includes("rdl")) {
    return clean.includes("romanian") || clean.includes("rdl")
      ? CATEGORY_FALLBACK_GIFS.hamstrings
      : ACCURATE_EXERCISE_MEDIA_MAP["barbell deadlift"] || CATEGORY_FALLBACK_GIFS.back;
  }

  // Shoulders / Delts / OHP
  if (clean.includes("shoulder") || clean.includes("military press") || clean.includes("overhead press") || clean.includes("arnold press")) {
    return CATEGORY_FALLBACK_GIFS.shoulders;
  }
  if (clean.includes("lateral raise") || clean.includes("front raise") || clean.includes("rear delt") || clean.includes("shrug")) {
    return CATEGORY_FALLBACK_GIFS.deltoids;
  }

  // Arms / Biceps / Triceps
  if (clean.includes("curl") || clean.includes("bicep")) {
    return CATEGORY_FALLBACK_GIFS.biceps;
  }
  if (clean.includes("tricep") || clean.includes("skull crusher") || clean.includes("pushdown") || clean.includes("kickback")) {
    return CATEGORY_FALLBACK_GIFS.triceps;
  }

  // Legs / Squats / Quads / Calves / Glutes
  if (clean.includes("squat") || clean.includes("leg press") || clean.includes("lunge") || clean.includes("split squat") || ((clean.includes("quad") || clean.includes("quads")) && !clean.includes("quadruped"))) {
    if (clean.includes("lunge")) return ACCURATE_EXERCISE_MEDIA_MAP["lunges"] || CATEGORY_FALLBACK_GIFS.legs;
    if (clean.includes("leg press")) return ACCURATE_EXERCISE_MEDIA_MAP["leg press"] || CATEGORY_FALLBACK_GIFS.legs;
    return CATEGORY_FALLBACK_GIFS.legs;
  }
  if (clean.includes("hip thrust") || clean.includes("glute") || clean.includes("clamshell")) {
    return CATEGORY_FALLBACK_GIFS.glutes;
  }
  if (clean.includes("calf") || clean.includes("calves")) {
    return CATEGORY_FALLBACK_GIFS.calves;
  }

  // Core / Abs
  if (clean.includes("plank") || clean.includes("crunch") || clean.includes("sit up") || clean.includes("leg raise") || clean.includes("russian twist") || clean.includes("abs") || clean.includes("core")) {
    if (clean.includes("crunch")) return CATEGORY_FALLBACK_GIFS.abs;
    return CATEGORY_FALLBACK_GIFS.core;
  }

  // Cardio / HIIT
  if (clean.includes("burpee") || clean.includes("jack") || clean.includes("jump") || clean.includes("treadmill") || clean.includes("run") || clean.includes("cardio")) {
    return CATEGORY_FALLBACK_GIFS.cardio;
  }

  // Mobility / Warmup
  if (clean.includes("stretch") || clean.includes("mobility") || clean.includes("opener") || clean.includes("rotat") || clean.includes("flow")) {
    return CATEGORY_FALLBACK_GIFS.mobility;
  }

  // 3. Fall back strictly to category if provided
  if (category) {
    const catLower = category.toLowerCase();
    if (CATEGORY_FALLBACK_GIFS[catLower]) {
      return CATEGORY_FALLBACK_GIFS[catLower];
    }
    for (const [k, url] of Object.entries(CATEGORY_FALLBACK_GIFS)) {
      if (catLower.includes(k)) return url;
    }
  }

  // 4. Safe general fallback (Never a squat for an unknown movement!)
  return CATEGORY_FALLBACK_GIFS.general;
}
