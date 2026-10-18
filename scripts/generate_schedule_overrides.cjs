const fs = require("fs");
const path = require("path");

// Load canonical exercises directly
const canFilePath = path.join(__dirname, "../src/data/canonicalExercises.ts");
const canFileContent = fs.readFileSync(canFilePath, "utf-8");

// Parse canonical exercises
const exerciseBlocks = canFileContent.split(/\{\s*id:\s*"/g).slice(1);
const exerciseMap = {};

for (const block of exerciseBlocks) {
  const id = block.split('"')[0];
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  const catMatch = block.match(/category:\s*"([^"]+)"/);
  const gifMatch = block.match(/gifUrl:\s*"([^"]+)"/);
  const diffMatch = block.match(/difficulty:\s*"([^"]+)"/);
  const eqMatch = block.match(/equipment:\s*\[([^\]]+)\]/);
  const mgMatch = block.match(/muscleGroups:\s*\[([^\]]+)\]/);
  const setsMatch = block.match(/recommendedSets:\s*"([^"]+)"/);
  const repsMatch = block.match(/recommendedReps:\s*"([^"]+)"/);
  const restMatch = block.match(/restTime:\s*"([^"]+)"/);
  const instrMatch = block.match(/instructions:\s*\[([\s\S]*?)\]/);

  if (id && nameMatch && gifMatch) {
    const equipment = eqMatch ? eqMatch[1].split(",").map(s => s.trim().replace(/"/g, "")) : ["Bodyweight"];
    const muscleGroups = mgMatch ? mgMatch[1].split(",").map(s => s.trim().replace(/"/g, "")) : ["Full Body"];
    let instructions = [];
    if (instrMatch) {
      instructions = instrMatch[1].split("\n").map(s => s.trim().replace(/^"/, "").replace(/",?$/, "")).filter(Boolean);
    }
    exerciseMap[id] = {
      id,
      exerciseName: nameMatch[1],
      category: catMatch ? catMatch[1] : "General",
      muscleGroup: muscleGroups,
      equipment,
      difficulty: diffMatch ? diffMatch[1] : "Beginner",
      sets: setsMatch ? (parseInt(setsMatch[1], 10) || 3) : 3,
      reps: repsMatch ? repsMatch[1] : "10-12 reps",
      restTime: restMatch ? restMatch[1] : "60s",
      gifUrl: gifMatch[1],
      instructions: instructions.length > 0 ? instructions : [`Execute ${nameMatch[1]} with strict form and controlled tempo.`],
      coachingCues: ["Maintain neutral spine", "Breathe smoothly", "Control concentric and eccentric tempo"]
    };
  }
}

console.log("Parsed", Object.keys(exerciseMap).length, "canonical exercises");

function getEx(id, overrides = {}) {
  const base = exerciseMap[id];
  if (!base) {
    console.error("Missing exercise id:", id);
    return null;
  }
  return { ...base, ...overrides };
}

function makeDayOverride(title, category, focus, isCardioOnly, cardioDistance, isRestDay, exercises, beginnerEx, intermediateEx, advancedEx) {
  const allList = exercises.filter(Boolean);
  const begList = (beginnerEx && beginnerEx.length > 0 ? beginnerEx : allList).filter(Boolean);
  const interList = (intermediateEx && intermediateEx.length > 0 ? intermediateEx : allList).filter(Boolean);
  const advList = (advancedEx && advancedEx.length > 0 ? advancedEx : allList).filter(Boolean);

  return {
    title,
    category,
    focus,
    isCardioOnly: !!isCardioOnly,
    cardioDistance: cardioDistance || "",
    isRestDay: !!isRestDay,
    estimatedDuration: isCardioOnly ? "50-70 mins" : isRestDay ? "20-30 mins" : "45-60 mins",
    estimatedCalories: isCardioOnly ? 500 : isRestDay ? 120 : 480,
    exercises: allList,
    levels: {
      beginner: begList,
      intermediate: interList,
      advanced: advList
    },
    beginnerExercises: begList,
    intermediateExercises: interList,
    advancedExercises: advList,
    guidelines: [
      `Focus: ${focus}.`,
      "Controlled tempo on both eccentric and concentric phases.",
      "Rest fully between working sets."
    ],
    coachingNotes: `${focus} - strict execution, no bouncing, lock into the mind-muscle connection.`
  };
}

const scheduleOverrides = {
  immortal_90: {},
  home_180: {},
  home_180_men: {},
  home_180_women: {},
  women_confidence: {},
  belly_fat_shred: {},
  posture_vitality: {}
};

// 1. IMMORTAL 90
const immortalCycle = {
  1: makeDayOverride(
    "Monday: Push", "Chest, shoulders and triceps", "Chest, shoulders and triceps",
    false, "", false,
    [
      getEx("ex_barbell_bench_press"),
      getEx("ex_incline_dumbbell_press"),
      getEx("ex_cable_chest_flyes"),
      getEx("ex_standard_pushups"),
      getEx("ex_triceps_rope_pushdown"),
      getEx("ex_skull_crushers"),
      getEx("ex_dumbbell_lateral_raises")
    ],
    // Beginner
    [
      getEx("ex_standard_pushups", { difficulty: "Beginner", sets: 3, reps: "8-10 reps" }),
      getEx("ex_incline_pushups", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_cable_chest_flyes", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_triceps_rope_pushdown", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_dumbbell_lateral_raises", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" })
    ],
    // Intermediate
    [
      getEx("ex_barbell_bench_press", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_incline_dumbbell_press", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_cable_chest_flyes", { sets: 3, reps: "12 reps" }),
      getEx("ex_triceps_rope_pushdown", { sets: 3, reps: "12 reps" }),
      getEx("ex_skull_crushers", { sets: 3, reps: "10 reps" }),
      getEx("ex_dumbbell_lateral_raises", { sets: 4, reps: "12 reps" })
    ],
    // Advanced
    [
      getEx("ex_barbell_bench_press", { sets: 4, reps: "6-8 reps" }),
      getEx("ex_incline_dumbbell_press", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_chest_dips", { sets: 4, reps: "10-12 reps" }),
      getEx("ex_cable_chest_flyes", { sets: 3, reps: "12-15 reps" }),
      getEx("ex_skull_crushers", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_close_grip_bench", { sets: 3, reps: "8-10 reps" }),
      getEx("ex_overhead_military_press", { sets: 4, reps: "8-10 reps" })
    ]
  ),
  2: makeDayOverride(
    "Tuesday: Pull", "Back, rear delts and biceps", "Back, rear delts and biceps",
    false, "", false,
    [
      getEx("ex_barbell_bent_over_row"),
      getEx("ex_lat_pulldown_wide"),
      getEx("ex_seated_cable_row"),
      getEx("ex_pullups"),
      getEx("ex_biceps_dumbbell_curl"),
      getEx("ex_incline_hammer_curls")
    ],
    // Beginner
    [
      getEx("ex_lat_pulldown_wide", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_seated_cable_row", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_biceps_dumbbell_curl", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_incline_hammer_curls", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" })
    ],
    // Intermediate
    [
      getEx("ex_barbell_bent_over_row", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_lat_pulldown_wide", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_seated_cable_row", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_biceps_dumbbell_curl", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_incline_hammer_curls", { sets: 3, reps: "10-12 reps" })
    ],
    // Advanced
    [
      getEx("ex_pullups", { sets: 4, reps: "8-12 reps" }),
      getEx("ex_barbell_bent_over_row", { sets: 4, reps: "6-8 reps" }),
      getEx("ex_lat_pulldown_wide", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_seated_cable_row", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_biceps_dumbbell_curl", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_incline_hammer_curls", { sets: 4, reps: "10-12 reps" })
    ]
  ),
  3: makeDayOverride(
    "Wednesday: Legs + Core", "Quads, hamstrings, glutes, calves and abs", "Quads, hamstrings, glutes, calves and abs",
    false, "", false,
    [
      getEx("ex_barbell_back_squat"),
      getEx("ex_romanian_deadlift"),
      getEx("ex_walking_lunges"),
      getEx("ex_leg_press_45"),
      getEx("ex_standing_calf_raises"),
      getEx("ex_plank_bracing"),
      getEx("ex_hanging_leg_raises")
    ],
    // Beginner
    [
      getEx("ex_bodyweight_air_squats", { difficulty: "Beginner", sets: 3, reps: "12-15 reps" }),
      getEx("ex_bodyweight_walking_lunges", { difficulty: "Beginner", sets: 3, reps: "10 reps per leg" }),
      getEx("ex_bodyweight_calf_raises", { difficulty: "Beginner", sets: 3, reps: "15 reps" }),
      getEx("ex_plank_bracing", { difficulty: "Beginner", sets: 3, reps: "30-45s" }),
      getEx("ex_bicycle_crunches", { difficulty: "Beginner", sets: 3, reps: "15 reps" })
    ],
    // Intermediate
    [
      getEx("ex_barbell_back_squat", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_romanian_deadlift", { sets: 3, reps: "10 reps" }),
      getEx("ex_walking_lunges", { sets: 3, reps: "12 reps" }),
      getEx("ex_leg_press_45", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_standing_calf_raises", { sets: 4, reps: "15 reps" }),
      getEx("ex_plank_bracing", { sets: 3, reps: "45-60s" }),
      getEx("ex_hanging_leg_raises", { sets: 3, reps: "12 reps" })
    ],
    // Advanced
    [
      getEx("ex_barbell_back_squat", { sets: 4, reps: "6-8 reps" }),
      getEx("ex_romanian_deadlift", { sets: 4, reps: "8 reps" }),
      getEx("ex_leg_press_45", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_bulgarian_split_squats_bw", { sets: 3, reps: "10 reps per leg" }),
      getEx("ex_standing_calf_raises", { sets: 4, reps: "15 reps" }),
      getEx("ex_hanging_leg_raises", { sets: 4, reps: "15 reps" }),
      getEx("ex_plank_bracing", { sets: 4, reps: "60s" })
    ]
  ),
  4: makeDayOverride(
    "Thursday: Cardio + Mobility", "Running, conditioning and mobility", "Running, conditioning and mobility",
    true, "5.0 - 10.0 KM", false,
    [
      getEx("ex_cardio_5_10km_run_walk"),
      getEx("ex_downward_dog_cobra"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_worlds_greatest_stretch"),
      getEx("ex_childs_pose_breathing")
    ],
    // Beginner
    [
      getEx("ex_cardio_5_10km_run_walk", { difficulty: "Beginner", reps: "3.0 - 5.0 KM Brisk Walk" }),
      getEx("ex_downward_dog_cobra", { difficulty: "Beginner", sets: 3, reps: "45s flow" }),
      getEx("ex_cat_cow_mobility", { difficulty: "Beginner", sets: 3, reps: "10 cycles" }),
      getEx("ex_childs_pose_breathing", { difficulty: "Beginner", sets: 3, reps: "60s" })
    ],
    // Intermediate
    [
      getEx("ex_cardio_5_10km_run_walk", { reps: "5.0 - 7.5 KM Tempo Run" }),
      getEx("ex_downward_dog_cobra", { sets: 3, reps: "60s flow" }),
      getEx("ex_cat_cow_mobility", { sets: 3, reps: "12 cycles" }),
      getEx("ex_worlds_greatest_stretch", { sets: 3, reps: "5 per side" }),
      getEx("ex_childs_pose_breathing", { sets: 3, reps: "60s" })
    ],
    // Advanced
    [
      getEx("ex_cardio_5_10km_run_walk", { reps: "8.0 - 10.0 KM Threshold Run" }),
      getEx("ex_downward_dog_cobra", { sets: 4, reps: "60s flow" }),
      getEx("ex_cat_cow_mobility", { sets: 3, reps: "15 cycles" }),
      getEx("ex_worlds_greatest_stretch", { sets: 4, reps: "6 per side" }),
      getEx("ex_childs_pose_breathing", { sets: 3, reps: "90s" })
    ]
  ),
  5: makeDayOverride(
    "Friday: Upper Body", "Chest, back, shoulders and arms", "Chest, back, shoulders and arms",
    false, "", false,
    [
      getEx("ex_incline_dumbbell_press"),
      getEx("ex_barbell_bent_over_row"),
      getEx("ex_barbell_bench_press"),
      getEx("ex_lat_pulldown_wide"),
      getEx("ex_dumbbell_lateral_raises"),
      getEx("ex_biceps_dumbbell_curl"),
      getEx("ex_triceps_rope_pushdown")
    ],
    // Beginner
    [
      getEx("ex_standard_pushups", { difficulty: "Beginner", sets: 3, reps: "8-10 reps" }),
      getEx("ex_lat_pulldown_wide", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_dumbbell_lateral_raises", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_biceps_dumbbell_curl", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_triceps_rope_pushdown", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" })
    ],
    // Intermediate
    [
      getEx("ex_incline_dumbbell_press", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_barbell_bent_over_row", { sets: 3, reps: "10 reps" }),
      getEx("ex_lat_pulldown_wide", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_dumbbell_lateral_raises", { sets: 4, reps: "12 reps" }),
      getEx("ex_biceps_dumbbell_curl", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_triceps_rope_pushdown", { sets: 3, reps: "12 reps" })
    ],
    // Advanced
    [
      getEx("ex_barbell_bench_press", { sets: 4, reps: "8 reps" }),
      getEx("ex_barbell_bent_over_row", { sets: 4, reps: "8 reps" }),
      getEx("ex_overhead_military_press", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_lat_pulldown_wide", { sets: 4, reps: "8-10 reps" }),
      getEx("ex_biceps_dumbbell_curl", { sets: 4, reps: "10 reps" }),
      getEx("ex_skull_crushers", { sets: 4, reps: "10 reps" })
    ]
  ),
  6: makeDayOverride(
    "Saturday: Athletic Conditioning + Core", "Functional movements, conditioning and abdominal work", "Functional movements, conditioning and abdominal work",
    false, "", false,
    [
      getEx("ex_burpees_conditioning"),
      getEx("ex_mountain_climbers"),
      getEx("ex_russian_twists"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_plank_bracing"),
      getEx("ex_bodyweight_air_squats")
    ],
    // Beginner
    [
      getEx("ex_mountain_climbers", { difficulty: "Beginner", sets: 3, reps: "20s" }),
      getEx("ex_bicycle_crunches", { difficulty: "Beginner", sets: 3, reps: "12 reps" }),
      getEx("ex_plank_bracing", { difficulty: "Beginner", sets: 3, reps: "30s" }),
      getEx("ex_bodyweight_air_squats", { difficulty: "Beginner", sets: 3, reps: "12 reps" })
    ],
    // Intermediate
    [
      getEx("ex_mountain_climbers", { sets: 3, reps: "30s" }),
      getEx("ex_russian_twists", { sets: 3, reps: "20 reps" }),
      getEx("ex_bicycle_crunches", { sets: 3, reps: "20 reps" }),
      getEx("ex_plank_bracing", { sets: 3, reps: "45s" }),
      getEx("ex_bodyweight_air_squats", { sets: 3, reps: "15 reps" })
    ],
    // Advanced
    [
      getEx("ex_burpees_conditioning", { sets: 4, reps: "15 reps" }),
      getEx("ex_mountain_climbers", { sets: 4, reps: "45s" }),
      getEx("ex_russian_twists", { sets: 4, reps: "25 reps" }),
      getEx("ex_hanging_leg_raises", { sets: 4, reps: "15 reps" }),
      getEx("ex_plank_bracing", { sets: 4, reps: "60s" })
    ]
  ),
  7: makeDayOverride(
    "Sunday: Recovery", "Recovery & System Reset", "Recovery & System Reset",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_figure4_glute_stretch"),
      getEx("ex_standing_quad_stretch"),
      getEx("ex_downward_dog_cobra")
    ],
    // Beginner
    [
      getEx("ex_childs_pose_breathing", { difficulty: "Beginner", sets: 3, reps: "60s" }),
      getEx("ex_cat_cow_mobility", { difficulty: "Beginner", sets: 3, reps: "10 cycles" }),
      getEx("ex_standing_quad_stretch", { difficulty: "Beginner", sets: 3, reps: "30s each" })
    ],
    // Intermediate
    [
      getEx("ex_childs_pose_breathing", { sets: 3, reps: "60s" }),
      getEx("ex_cat_cow_mobility", { sets: 3, reps: "12 cycles" }),
      getEx("ex_figure4_glute_stretch", { sets: 3, reps: "45s each" }),
      getEx("ex_standing_quad_stretch", { sets: 3, reps: "45s each" }),
      getEx("ex_downward_dog_cobra", { sets: 3, reps: "60s flow" })
    ],
    // Advanced
    [
      getEx("ex_childs_pose_breathing", { sets: 4, reps: "90s" }),
      getEx("ex_cat_cow_mobility", { sets: 4, reps: "15 cycles" }),
      getEx("ex_figure4_glute_stretch", { sets: 4, reps: "60s each" }),
      getEx("ex_standing_quad_stretch", { sets: 4, reps: "60s each" }),
      getEx("ex_worlds_greatest_stretch", { sets: 4, reps: "6 per side" }),
      getEx("ex_downward_dog_cobra", { sets: 4, reps: "60s flow" })
    ]
  )
};

// 2. HOME 180 (Men)
const home180MenCycle = {
  1: makeDayOverride(
    "Monday: Upper Body Push & Calisthenics", "Chest, Shoulders & Triceps", "Chest, Shoulders & Triceps",
    false, "", false,
    [
      getEx("ex_standard_pushups"),
      getEx("ex_incline_pushups"),
      getEx("ex_decline_pushups"),
      getEx("ex_diamond_pushups"),
      getEx("ex_bench_dips_bodyweight")
    ],
    // Beginner
    [
      getEx("ex_incline_pushups", { difficulty: "Beginner", sets: 3, reps: "8-10 reps" }),
      getEx("ex_standard_pushups", { difficulty: "Beginner", sets: 3, reps: "6-8 reps" }),
      getEx("ex_bench_dips_bodyweight", { difficulty: "Beginner", sets: 3, reps: "8-10 reps" })
    ],
    // Intermediate
    [
      getEx("ex_standard_pushups", { sets: 4, reps: "12-15 reps" }),
      getEx("ex_decline_pushups", { sets: 3, reps: "10-12 reps" }),
      getEx("ex_diamond_pushups", { sets: 3, reps: "8-10 reps" }),
      getEx("ex_bench_dips_bodyweight", { sets: 3, reps: "12-15 reps" })
    ],
    // Advanced
    [
      getEx("ex_standard_pushups", { sets: 5, reps: "20 reps" }),
      getEx("ex_diamond_pushups", { sets: 4, reps: "12-15 reps" }),
      getEx("ex_decline_pushups", { sets: 4, reps: "15 reps" }),
      getEx("ex_bench_dips_bodyweight", { sets: 4, reps: "20 reps" })
    ]
  ),
  2: makeDayOverride(
    "Tuesday: Core & Abs Shred", "Core, Abs & Obliques", "Core, Abs & Obliques",
    false, "", false,
    [
      getEx("ex_plank_bracing"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_russian_twists"),
      getEx("ex_mountain_climbers")
    ],
    // Beginner
    [
      getEx("ex_plank_bracing", { difficulty: "Beginner", sets: 3, reps: "30s" }),
      getEx("ex_bicycle_crunches", { difficulty: "Beginner", sets: 3, reps: "10 reps" }),
      getEx("ex_mountain_climbers", { difficulty: "Beginner", sets: 3, reps: "20s" })
    ],
    // Intermediate
    [
      getEx("ex_plank_bracing", { sets: 3, reps: "45-60s" }),
      getEx("ex_bicycle_crunches", { sets: 3, reps: "15-20 reps" }),
      getEx("ex_russian_twists", { sets: 3, reps: "20 reps" }),
      getEx("ex_mountain_climbers", { sets: 3, reps: "30s" })
    ],
    // Advanced
    [
      getEx("ex_plank_bracing", { sets: 4, reps: "60-90s" }),
      getEx("ex_bicycle_crunches", { sets: 4, reps: "25 reps" }),
      getEx("ex_russian_twists", { sets: 4, reps: "30 reps" }),
      getEx("ex_mountain_climbers", { sets: 4, reps: "45s" })
    ]
  ),
  3: makeDayOverride(
    "Wednesday: Lower Body & Legs", "Quads, Hamstrings & Calves", "Quads, Hamstrings & Calves",
    false, "", false,
    [
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_bodyweight_walking_lunges"),
      getEx("ex_wall_sit_isometric"),
      getEx("ex_bodyweight_calf_raises"),
      getEx("ex_glute_bridges")
    ],
    // Beginner
    [
      getEx("ex_bodyweight_air_squats", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_glute_bridges", { difficulty: "Beginner", sets: 3, reps: "12 reps" }),
      getEx("ex_bodyweight_calf_raises", { difficulty: "Beginner", sets: 3, reps: "15 reps" })
    ],
    // Intermediate
    [
      getEx("ex_bodyweight_air_squats", { sets: 4, reps: "15-20 reps" }),
      getEx("ex_bodyweight_walking_lunges", { sets: 3, reps: "12 reps per leg" }),
      getEx("ex_wall_sit_isometric", { sets: 3, reps: "45s" }),
      getEx("ex_bodyweight_calf_raises", { sets: 4, reps: "20 reps" }),
      getEx("ex_glute_bridges", { sets: 3, reps: "15 reps" })
    ],
    // Advanced
    [
      getEx("ex_bulgarian_split_squats_bw", { sets: 4, reps: "12 reps per leg" }),
      getEx("ex_bodyweight_air_squats", { sets: 4, reps: "25 reps" }),
      getEx("ex_bodyweight_walking_lunges", { sets: 4, reps: "16 reps per leg" }),
      getEx("ex_wall_sit_isometric", { sets: 4, reps: "60s" }),
      getEx("ex_bodyweight_calf_raises", { sets: 4, reps: "25 reps" })
    ]
  ),
  4: makeDayOverride(
    "Thursday: Cardio + Mobility", "Cardio & Joint Mobility", "Cardio & Joint Mobility",
    true, "5.0 - 10.0 KM", false,
    [
      getEx("ex_cardio_5_10km_run_walk"),
      getEx("ex_downward_dog_cobra"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_standing_quad_stretch")
    ]
  ),
  5: makeDayOverride(
    "Friday: Upper Body Pull & Back", "Back, Biceps & Posture", "Back, Biceps & Posture",
    false, "", false,
    [
      getEx("ex_pullups"),
      getEx("ex_incline_pushups"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_downward_dog_cobra")
    ]
  ),
  6: makeDayOverride(
    "Saturday: Athletic Full Body Conditioning", "Functional Power & Stamina", "Functional Power & Stamina",
    false, "", false,
    [
      getEx("ex_burpees_conditioning"),
      getEx("ex_mountain_climbers"),
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_plank_bracing")
    ]
  ),
  7: makeDayOverride(
    "Sunday: Recovery", "Regenerative Mobility & Rest", "Regenerative Mobility & Rest",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_figure4_glute_stretch"),
      getEx("ex_standing_quad_stretch")
    ]
  )
};

// 3. WOMEN CONFIDENCE
const womenConfidenceCycle = {
  1: makeDayOverride(
    "Monday: Glutes + Hamstrings", "Glutes + Hamstrings", "Glutes + Hamstrings",
    false, "", false,
    [
      getEx("ex_glute_bridges"),
      getEx("ex_bodyweight_walking_lunges"),
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_bulgarian_split_squats_bw"),
      getEx("ex_figure4_glute_stretch")
    ],
    // Beginner
    [
      getEx("ex_glute_bridges", { difficulty: "Beginner", sets: 3, reps: "12-15 reps" }),
      getEx("ex_bodyweight_air_squats", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_figure4_glute_stretch", { difficulty: "Beginner", sets: 3, reps: "30s each" })
    ],
    // Intermediate
    [
      getEx("ex_glute_bridges", { sets: 4, reps: "15 reps" }),
      getEx("ex_bodyweight_walking_lunges", { sets: 3, reps: "12 reps per leg" }),
      getEx("ex_bodyweight_air_squats", { sets: 3, reps: "15 reps" }),
      getEx("ex_figure4_glute_stretch", { sets: 3, reps: "45s each" })
    ],
    // Advanced
    [
      getEx("ex_glute_bridges", { sets: 4, reps: "20 reps" }),
      getEx("ex_bulgarian_split_squats_bw", { sets: 4, reps: "12 reps per leg" }),
      getEx("ex_bodyweight_walking_lunges", { sets: 4, reps: "15 reps per leg" }),
      getEx("ex_figure4_glute_stretch", { sets: 4, reps: "60s each" })
    ]
  ),
  2: makeDayOverride(
    "Tuesday: Upper Body + Core", "Upper Body + Core", "Upper Body + Core",
    false, "", false,
    [
      getEx("ex_incline_pushups"),
      getEx("ex_bench_dips_bodyweight"),
      getEx("ex_plank_bracing"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_cat_cow_mobility")
    ]
  ),
  3: makeDayOverride(
    "Wednesday: Quads + Glutes", "Quads + Glutes", "Quads + Glutes",
    false, "", false,
    [
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_wall_sit_isometric"),
      getEx("ex_glute_bridges"),
      getEx("ex_bodyweight_calf_raises"),
      getEx("ex_standing_quad_stretch")
    ]
  ),
  4: makeDayOverride(
    "Thursday: Cardio + Core + Mobility", "Cardio + Core + Mobility", "Cardio + Core + Mobility",
    true, "3.0 - 5.0 KM", false,
    [
      getEx("ex_cardio_5_10km_run_walk"),
      getEx("ex_mountain_climbers"),
      getEx("ex_plank_bracing"),
      getEx("ex_childs_pose_breathing")
    ]
  ),
  5: makeDayOverride(
    "Friday: Glutes + Full Lower Body", "Glutes + Full Lower Body", "Glutes + Full Lower Body",
    false, "", false,
    [
      getEx("ex_glute_bridges"),
      getEx("ex_bodyweight_walking_lunges"),
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_bulgarian_split_squats_bw"),
      getEx("ex_figure4_glute_stretch")
    ]
  ),
  6: makeDayOverride(
    "Saturday: Full Body Conditioning", "Full Body Conditioning", "Full Body Conditioning",
    false, "", false,
    [
      getEx("ex_burpees_conditioning"),
      getEx("ex_mountain_climbers"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_plank_bracing")
    ]
  ),
  7: makeDayOverride(
    "Sunday: Recovery", "Restorative Recovery", "Restorative Recovery",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_figure4_glute_stretch"),
      getEx("ex_standing_quad_stretch")
    ]
  )
};

// 4. BELLY FAT SHRED
const bellyFatCycle = {
  1: makeDayOverride(
    "Monday: Full Body + Core", "Full Body + Core", "Full Body + Core",
    false, "", false,
    [
      getEx("ex_plank_bracing"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_standard_pushups"),
      getEx("ex_mountain_climbers")
    ],
    // Beginner
    [
      getEx("ex_plank_bracing", { difficulty: "Beginner", sets: 3, reps: "30s" }),
      getEx("ex_bicycle_crunches", { difficulty: "Beginner", sets: 3, reps: "10-12 reps" }),
      getEx("ex_incline_pushups", { difficulty: "Beginner", sets: 3, reps: "8 reps" }),
      getEx("ex_bodyweight_air_squats", { difficulty: "Beginner", sets: 3, reps: "10 reps" })
    ],
    // Intermediate
    [
      getEx("ex_plank_bracing", { sets: 3, reps: "45-60s" }),
      getEx("ex_bicycle_crunches", { sets: 3, reps: "15 reps" }),
      getEx("ex_standard_pushups", { sets: 3, reps: "12 reps" }),
      getEx("ex_bodyweight_air_squats", { sets: 3, reps: "15 reps" }),
      getEx("ex_mountain_climbers", { sets: 3, reps: "30s" })
    ],
    // Advanced
    [
      getEx("ex_burpees_conditioning", { sets: 4, reps: "15 reps" }),
      getEx("ex_plank_bracing", { sets: 4, reps: "60s" }),
      getEx("ex_bicycle_crunches", { sets: 4, reps: "25 reps" }),
      getEx("ex_standard_pushups", { sets: 4, reps: "20 reps" }),
      getEx("ex_mountain_climbers", { sets: 4, reps: "45s" })
    ]
  ),
  2: makeDayOverride(
    "Tuesday: Cardio + Abs", "Cardio + Abs", "Cardio + Abs",
    true, "Cardio Intervals", false,
    [
      getEx("ex_cardio_5_10km_run_walk"),
      getEx("ex_russian_twists"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_plank_bracing")
    ]
  ),
  3: makeDayOverride(
    "Wednesday: Full Body Strength", "Full Body Strength", "Full Body Strength",
    false, "", false,
    [
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_standard_pushups"),
      getEx("ex_bench_dips_bodyweight"),
      getEx("ex_bodyweight_walking_lunges"),
      getEx("ex_plank_bracing")
    ]
  ),
  4: makeDayOverride(
    "Thursday: Cardio + Core", "Cardio + Core", "Cardio + Core",
    true, "Cardio Conditioning", false,
    [
      getEx("ex_mountain_climbers"),
      getEx("ex_russian_twists"),
      getEx("ex_bicycle_crunches"),
      getEx("ex_plank_bracing"),
      getEx("ex_cardio_5_10km_run_walk")
    ]
  ),
  5: makeDayOverride(
    "Friday: Full Body Conditioning", "Full Body Conditioning", "Full Body Conditioning",
    false, "", false,
    [
      getEx("ex_burpees_conditioning"),
      getEx("ex_mountain_climbers"),
      getEx("ex_bodyweight_air_squats"),
      getEx("ex_standard_pushups")
    ]
  ),
  6: makeDayOverride(
    "Saturday: Walking + Mobility", "Walking + Mobility", "Walking + Mobility",
    true, "5.0 - 10.0 KM Brisk Walk", false,
    [
      getEx("ex_cardio_5_10km_run_walk"),
      getEx("ex_downward_dog_cobra"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_standing_quad_stretch")
    ]
  ),
  7: makeDayOverride(
    "Sunday: Recovery", "Recovery & System Reset", "Recovery & System Reset",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_cat_cow_mobility"),
      getEx("ex_figure4_glute_stretch"),
      getEx("ex_downward_dog_cobra")
    ]
  )
};

// 5. POSTURE VITALITY
const postureCycle = {
  1: makeDayOverride(
    "Monday: Upper Back + Shoulder Mobility", "Upper Back + Shoulder Mobility", "Upper Back + Shoulder Mobility",
    false, "", false,
    [
      getEx("ex_cat_cow_mobility"),
      getEx("ex_worlds_greatest_stretch"),
      getEx("ex_downward_dog_cobra"),
      getEx("ex_childs_pose_breathing")
    ]
  ),
  2: makeDayOverride(
    "Tuesday: Core Stability + Hip Mobility", "Core Stability + Hip Mobility", "Core Stability + Hip Mobility",
    false, "", false,
    [
      getEx("ex_plank_bracing"),
      getEx("ex_figure4_glute_stretch"),
      getEx("ex_standing_quad_stretch"),
      getEx("ex_cat_cow_mobility")
    ]
  ),
  3: makeDayOverride(
    "Wednesday: Full Body Posture Training", "Full Body Posture Training", "Full Body Posture Training",
    false, "", false,
    [
      getEx("ex_cat_cow_mobility"),
      getEx("ex_downward_dog_cobra"),
      getEx("ex_worlds_greatest_stretch"),
      getEx("ex_plank_bracing")
    ]
  ),
  4: makeDayOverride(
    "Thursday: Recovery Mobility", "Recovery Mobility", "Recovery Mobility",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_standing_quad_stretch"),
      getEx("ex_figure4_glute_stretch")
    ]
  ),
  5: makeDayOverride(
    "Friday: Upper Back + Core", "Upper Back + Core", "Upper Back + Core",
    false, "", false,
    [
      getEx("ex_cat_cow_mobility"),
      getEx("ex_plank_bracing"),
      getEx("ex_downward_dog_cobra")
    ]
  ),
  6: makeDayOverride(
    "Saturday: Full Body Mobility + Stability", "Full Body Mobility + Stability", "Full Body Mobility + Stability",
    false, "", false,
    [
      getEx("ex_worlds_greatest_stretch"),
      getEx("ex_plank_bracing"),
      getEx("ex_figure4_glute_stretch")
    ]
  ),
  7: makeDayOverride(
    "Sunday: Recovery", "Restorative Recovery", "Restorative Recovery",
    false, "", true,
    [
      getEx("ex_childs_pose_breathing"),
      getEx("ex_cat_cow_mobility")
    ]
  )
};

// Populate 7-day cyclical keys and individual day numbers
function populateCycles(targetObj, cycleSource, totalDays = 90) {
  for (let c = 1; c <= 7; c++) {
    targetObj[`cycle_${c}`] = cycleSource[c];
  }
  for (let d = 1; d <= totalDays; d++) {
    const cycleDay = ((d - 1) % 7) + 1;
    const base = cycleSource[cycleDay];
    targetObj[String(d)] = {
      ...base,
      title: `Day ${d}: ${base.category}`
    };
  }
}

populateCycles(scheduleOverrides.immortal_90, immortalCycle, 90);
populateCycles(scheduleOverrides.home_180, home180MenCycle, 180);
populateCycles(scheduleOverrides.home_180_men, home180MenCycle, 180);
populateCycles(scheduleOverrides.home_180_women, womenConfidenceCycle, 180);
populateCycles(scheduleOverrides.women_confidence, womenConfidenceCycle, 180);
populateCycles(scheduleOverrides.belly_fat_shred, bellyFatCycle, 140);
populateCycles(scheduleOverrides.posture_vitality, postureCycle, 60);

const outputPath = path.join(__dirname, "../src/data/program_schedule_overrides.json");
fs.writeFileSync(outputPath, JSON.stringify(scheduleOverrides, null, 2), "utf-8");
console.log("Successfully wrote complete verified schedule overrides to", outputPath);
