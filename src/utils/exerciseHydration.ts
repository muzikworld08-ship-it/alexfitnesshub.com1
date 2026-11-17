import type { Exercise } from "../data/exercises";

export interface DerivedExerciseMetadata {
  name: string;
  category: string;
  categories: string[];
  muscleGroups: string[];
  equipment: string[];
}

const UPPERCASE_WORDS = new Set(["rdl", "hiit", "ez", "db", "bb", "kb", "t"]);

export function formatExerciseTitleFromSlug(slugOrId: string): string {
  const cleaned = String(slugOrId || "")
    .trim()
    .replace(/^exercise[-_]/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  return cleaned
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (UPPERCASE_WORDS.has(lower)) return lower.toUpperCase();
      if (/^\d+$/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function deriveExerciseNameFromEntry(key: string, val: Record<string, any>): string {
  if (!val || typeof val !== "object") return "";
  const explicit = String(val.name || val.exerciseName || "").trim();
  if (explicit) return explicit;

  const idOrKey = String(val.id || val.exerciseId || key || "").trim();
  if (/^exercise[-_]/i.test(idOrKey)) {
    return formatExerciseTitleFromSlug(idOrKey);
  }
  return "";
}

export function inferExerciseMetadataFromName(name: string, val?: Record<string, any>): DerivedExerciseMetadata {
  const cleanName = String(name || "").trim();
  const l = cleanName.toLowerCase();

  let category = String(val?.category || "").trim();
  let muscleGroups: string[] = Array.isArray(val?.muscleGroups) && val!.muscleGroups.length > 0
    ? val!.muscleGroups
    : (Array.isArray(val?.muscleGroup) && val!.muscleGroup.length > 0 ? val!.muscleGroup : []);
  let equipment: string[] = Array.isArray(val?.equipment) && val!.equipment.length > 0
    ? val!.equipment
    : (typeof val?.equipment === "string" && val.equipment.trim() ? [val.equipment.trim()] : []);

  if (!category) {
    if (/(stretch|mobility|yoga|pose|flow|warm-up|warmup|90 90)/.test(l)) {
      category = "Mobility & Stretching";
    } else if (/(treadmill|cardio|burpee|jumping|jump rope|sprint|run|jog|bear crawl|high knees|cycling|bike|rowing|skipping)/.test(l)) {
      category = "Cardio";
    } else if (/(bicep|hammer curl|preacher curl|concentration curl|bayesian|spider curl|wrist curl)/.test(l)) {
      category = "Biceps";
    } else if (/(tricep|skull crusher|pushdown|kickback|dip|overhead extension|close grip bench)/.test(l)) {
      category = "Triceps";
    } else if (/(shoulder|deltoid|lateral raise|front raise|rear delt|arnold press|overhead press|military press|upright row|face pull|6 way raise|shrug)/.test(l)) {
      category = "Shoulders";
    } else if (/(squat|lunge|deadlift|leg press|leg curl|leg extension|calf|glute|hip thrust|bridge|step up|bulgarian|rdl|stiff leg|good morning)/.test(l)) {
      category = "Legs";
    } else if (/(pull up|pull-up|chin up|chin-up|lat pulldown|row|back extension|hyperextension|pullover)/.test(l)) {
      category = "Back";
    } else if (/(bench press|chest|pec|fly|flye|push up|push-up|pushup|decline press|incline press)/.test(l)) {
      category = "Chest";
    } else if (/(crunch|plank|ab wheel|rollout|leg raise|russian twist|dead bug|sit up|sit-up|core|oblique|v-up|mountain climber|hollow)/.test(l)) {
      category = "Core";
    } else {
      category = "Gym Workouts";
    }
  }

  if (muscleGroups.length === 0) {
    const mapMuscles: Record<string, string[]> = {
      "Chest": ["Chest", "Triceps"],
      "Back": ["Back", "Lats"],
      "Shoulders": ["Shoulders", "Deltoids"],
      "Biceps": ["Biceps", "Forearms"],
      "Triceps": ["Triceps"],
      "Legs": ["Legs", "Glutes", "Quads"],
      "Core": ["Core", "Abs"],
      "Cardio": ["Cardio", "Full Body"],
      "Mobility & Stretching": ["Flexibility", "Full Body"],
      "Gym Workouts": ["Full Body"]
    };
    muscleGroups = mapMuscles[category] || [category];
  }

  if (equipment.length === 0) {
    if (/(barbell|ez-bar|ez bar|smith)/.test(l)) {
      equipment = ["Barbell"];
    } else if (/(dumbbell|arnold|6 way|lateral raise)/.test(l)) {
      equipment = ["Dumbbells"];
    } else if (/(cable|pulldown|pushdown|face pull|bayesian)/.test(l)) {
      equipment = ["Cable"];
    } else if (/(kettlebell)/.test(l)) {
      equipment = ["Kettlebell"];
    } else if (/(machine|pec deck|leg press|treadmill|hack squat)/.test(l)) {
      equipment = ["Machine"];
    } else if (/(band|resistance band)/.test(l)) {
      equipment = ["Resistance Band"];
    } else {
      equipment = ["Bodyweight"];
    }
  }

  const rawCategories = Array.isArray(val?.categories) && val!.categories.length > 0 ? val!.categories : [category];
  const categories = Array.from(new Set([category, ...rawCategories]));

  return {
    name: cleanName,
    category,
    categories,
    muscleGroups,
    equipment
  };
}

export function buildTombstoneMatcher(deletedIds: Iterable<string>) {
  const exactSet = new Set<string>();
  const cleanSet = new Set<string>();

  for (const raw of deletedIds) {
    const s = String(raw || "").trim().toLowerCase();
    if (!s) continue;
    exactSet.add(s);
    const cleaned = s.replace(/^exercise[-_]/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    if (cleaned) {
      cleanSet.add(cleaned);
    }
  }

  return (idOrKey?: string | null, name?: string | null): boolean => {
    const candidates = [idOrKey, name].filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    for (const c of candidates) {
      const lower = c.trim().toLowerCase();
      if (exactSet.has(lower)) return true;

      const cleaned = lower.replace(/^exercise[-_]/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
      if (!cleaned) continue;
      if (cleanSet.has(cleaned)) return true;
      // Match simple singular/plural tombstones (e.g. "bicycle crunch" vs "bicycle crunches")
      if (cleanSet.has(cleaned + "s") || cleanSet.has(cleaned + "es")) return true;
      if (cleaned.endsWith("s") && cleanSet.has(cleaned.slice(0, -1))) return true;
      if (cleaned.endsWith("es") && cleanSet.has(cleaned.slice(0, -2))) return true;
    }
    return false;
  };
}

export function hydrateHiddenOverrideExercises(
  mergedOverrides: Record<string, any>,
  baseExercises: Exercise[],
  deletedIds: Iterable<string>,
  isUsableMedia: (u: any) => u is string,
  getExactCanonicalGif: (name: string, category?: string) => string
): Exercise[] {
  const isTombstoned = buildTombstoneMatcher(deletedIds);
  const baseList = baseExercises.filter((e) => !isTombstoned(e.id, e.name));
  const customMap = new Map<string, Exercise>();
  const seenNames = new Set<string>(baseList.map((b) => (b.name || "").toLowerCase().trim()).filter(Boolean));

  // Two passes: Pass 1 processes rich/explicit named records first, Pass 2 processes slug-only exercise-* records
  const keys = Object.keys(mergedOverrides);
  const orderedKeys = [
    ...keys.filter((k) => mergedOverrides[k]?.name || mergedOverrides[k]?.exerciseName),
    ...keys.filter((k) => !mergedOverrides[k]?.name && !mergedOverrides[k]?.exerciseName)
  ];

  for (const key of orderedKeys) {
    const val = mergedOverrides[key];
    if (!val || typeof val !== "object" || val.isDeleted === true) continue;

    const derivedName = deriveExerciseNameFromEntry(key, val);
    if (!derivedName) continue;

    const normName = derivedName.toLowerCase().trim();
    const canonicalId =
      val.id && typeof val.id === "string" && val.id.trim().length > 0
        ? val.id.trim()
        : val.exerciseId && typeof val.exerciseId === "string" && val.exerciseId.trim().length > 0
        ? val.exerciseId.trim()
        : key;

    if (isTombstoned(canonicalId, derivedName) || isTombstoned(key, normName)) continue;

    // Skip if already covered by an active base exercise
    const isBase = baseList.some(
      (b) => b.id === canonicalId || b.id === key || (b.name || "").toLowerCase().trim() === normName
    );
    if (isBase) continue;

    const usableCustomMedia = [val.customMediaUrl].find(isUsableMedia) || "";
    const explicitMedia = [val.customMediaUrl, val.gifUrl, val.imageUrl, val.originalUrlOrBase64].find(isUsableMedia) || "";
    const canonicalGif = getExactCanonicalGif(derivedName, val.category);
    const resolvedGif = explicitMedia || canonicalGif || "";

    const isValidSavedExercise =
      val.isCustom === true ||
      Boolean(canonicalId && derivedName && (val.category || (Array.isArray(val.muscleGroups) && val.muscleGroups.length > 0) || explicitMedia));

    if (!isValidSavedExercise) continue;

    const meta = inferExerciseMetadataFromName(derivedName, val);

    if (!seenNames.has(normName) && !customMap.has(canonicalId)) {
      seenNames.add(normName);
      customMap.set(canonicalId, {
        difficulty: val.difficulty || "Intermediate",
        recommendedSets: val.recommendedSets || "3-4",
        recommendedReps: val.recommendedReps || "10-12",
        recommendedSetsReps: `${val.recommendedSets || "3-4"} Sets x ${val.recommendedReps || "10-12"} Reps`,
        instructions: Array.isArray(val.instructions) && val.instructions.length > 0
          ? val.instructions
          : [`Perform ${meta.name} through a full, controlled range of motion.`],
        ...val,
        id: canonicalId,
        name: meta.name,
        category: meta.category,
        categories: meta.categories,
        muscleGroups: meta.muscleGroups,
        equipment: meta.equipment,
        gifUrl: resolvedGif,
        imageUrl: resolvedGif,
        customMediaUrl: usableCustomMedia,
        isCustom: true
      } as Exercise);
    } else if (customMap.has(canonicalId)) {
      const existing = customMap.get(canonicalId)!;
      const mergedGif =
        [val.customMediaUrl, val.gifUrl, val.imageUrl, val.originalUrlOrBase64].find(isUsableMedia) ||
        existing.gifUrl ||
        resolvedGif;
      const mergedCustomMedia = usableCustomMedia || existing.customMediaUrl || "";
      customMap.set(canonicalId, {
        ...existing,
        ...val,
        id: canonicalId,
        name: meta.name,
        category: meta.category,
        categories: meta.categories,
        muscleGroups: meta.muscleGroups,
        equipment: meta.equipment,
        gifUrl: mergedGif,
        imageUrl: mergedGif,
        customMediaUrl: mergedCustomMedia,
        isCustom: true
      });
    }
  }

  return Array.from(customMap.values());
}
