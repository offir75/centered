export type Language = 'en' | 'he';

type ElementKey = 'fire' | 'water' | 'air' | 'earth';

export type WheelDomainKey =
  | 'work'
  | 'family'
  | 'partnership'
  | 'body'
  | 'leisure'
  | 'externalWorld'
  | 'finances'
  | 'community';

type StepTranslation = {
  key: ElementKey;
  icon: string;
  title: string;
  labelStart: string;
  labelEnd: string;
  descriptions: {
    low: string;
    mid: string;
    high: string;
  };
};

type ResultTranslation = Record<
  ElementKey,
  {
    highText: string;
    lowText: string;
    highAction: string;
    lowAction: string;
  }
>;

export type Translations = {
  appName: string;
  homeLabel: string;
  progressLabel: string;
  intro: {
    title: string;
    description: string;
  };
  buttons: {
    start: string;
    next: string;
    calculate: string;
    reset: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    elements: {
      title: string;
      description: string;
    };
    notNow: {
      title: string;
      description: string;
    };
    wheel: {
      title: string;
      description: string;
    };
  };
  result: {
    heading: string;
    diagnosisLabel: string;
    taskLabel: string;
    tokenAlert: string;
  };
  languageSwitcher: {
    label: string;
    en: string;
    he: string;
  };
  notNow: {
    title: string;
    subtitle: string;
    mantra: string;
    cancel: string;
    breathIn: string;
    breathOut: string;
    stayCentred: string;
    success: string;
    finish: string;
  };
  wheelOfLife: {
    intro: {
      title: string;
      description: string;
      cta: string;
    };
    progress: string;
    domains: Record<WheelDomainKey, string>;
    domainDescriptions: Record<WheelDomainKey, string>;
    time: {
      title: string;
      subtext: string;
      lowLabel: string;
      highLabel: string;
    };
    suffering: {
      title: string;
      subtext: string;
      lowLabel: string;
      highLabel: string;
    };
    back: string;
    seeResults: string;
    analysis: {
      heading: string;
      tier: {
        low: string;
        moderate: string;
        high: string;
      };
      trend: {
        improved: string;
        declined: string;
        same: string;
        firstTime: string;
      };
      wheelCaption: string;
      practiceHeading: string;
      practiceIntro: string;
      practices: {
        notNow: { title: string; description: string };
        breathing: { title: string; description: string };
        headHeart: { title: string; description: string };
      };
      finish: string;
    };
  };
  steps: StepTranslation[];
  results: ResultTranslation;
};

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Centered',
    homeLabel: 'Home',
    progressLabel: '4 Elements progress',
    intro: {
      title: 'How is your energy today?',
      description:
        "Every day we use energy through four channels: doing (fire), feeling (water), thinking (air), and body (earth). Let's see which one took the most from you today so you can balance it.",
    },
    buttons: {
      start: 'Get started',
      next: 'Next',
      calculate: 'Calculate my map',
      reset: 'Try again',
    },
    dashboard: {
      title: 'Your practice hub',
      subtitle: 'Launch the 4 Elements practice or explore the next tools coming soon.',
      elements: {
        title: '4 Elements Practice',
        description: 'Measure your energy across fire, water, air and earth in a guided mini-wizard.',
      },
      notNow: {
        title: 'Not Now Timer',
        description: 'When an urge strikes, pause and practice saying "not now" for 60 seconds.',
      },
      wheel: {
        title: 'Wheel of Life',
        description: 'Map your life balance across 8 domains and see where energy flows.',
      },
    },
    result: {
      heading: 'Your energy map',
      diagnosisLabel: 'Diagnosis:',
      taskLabel: 'Your task:',
      tokenAlert: '🎁 Complete the task to earn a presence token!',
    },
    languageSwitcher: {
      label: 'Language',
      en: 'English',
      he: 'עברית',
    },
    notNow: {
      title: 'The Center Restorer',
      subtitle: 'When an urge strikes, sit upright. Do not fight it. Simply state:',
      mantra: 'Not Now',
      cancel: 'Cancel',
      breathIn: 'Inhale...',
      breathOut: 'Exhale...',
      stayCentred: 'Be Present',
      success: 'The wave passed! You earned +1 Here & Now Token',
      finish: 'Return to Hub',
    },
    wheelOfLife: {
      intro: {
        title: 'Your Wheel of Life',
        description:
          "This is a tool for awareness, not judgment — there's no such thing as a perfect wheel. You'll rate 8 areas of your life one by one, then see where your energy is flowing and where it's stuck.",
        cta: 'Begin',
      },
      progress: 'Domain {current}/{total}',
      domains: {
        work: 'Career & Work',
        family: 'Family & Parenting',
        partnership: 'Romantic Partnership',
        body: 'Body & Health',
        leisure: 'Leisure & Hobbies',
        externalWorld: 'External World',
        finances: 'Finances',
        community: 'Community & Friends',
      },
      domainDescriptions: {
        work: 'How does your career or work demands affect your energy and focus?',
        family: 'How balanced do you feel in your role as a parent or family member?',
        partnership: 'How centered do you feel in your romantic relationship?',
        body: 'How connected and cared for does your body feel right now?',
        leisure: 'How much room do you give yourself for rest, play, and hobbies?',
        externalWorld:
          'How much of your energy is absorbed by the environment around you? Consider your daily commute, traffic, and the impact of news and current events on your inner peace.',
        finances: 'How much does money and financial security weigh on your mind?',
        community: 'How supported do you feel by your friends and community?',
      },
      time: {
        title: 'Time & Energy Investment',
        subtext: '1 = Almost no time/energy spent, 10 = Consumes most of my waking hours/energy',
        lowLabel: 'Barely any',
        highLabel: 'Consumes my day',
      },
      suffering: {
        title: 'Suffering / Distress Level',
        subtext: '1 = No suffering / Inner peace, 10 = Maximum suffering / Agony',
        lowLabel: 'No suffering',
        highLabel: 'Max suffering',
      },
      back: 'Back',
      seeResults: 'See My Results',
      analysis: {
        heading: 'Your Balance Score',
        tier: {
          low: "There's real inner conflict pulling you from your center right now. A grounding practice can help bring you back.",
          moderate: "You're aware of what's going on, but energy is leaking somewhere. Keep observing your patterns.",
          high: "You're in a stable, centered place right now. Keep practicing noticing the dance between Head and Heart.",
        },
        trend: {
          improved: '↑ Better than your last check-in',
          declined: '↓ A bit lower than your last check-in',
          same: '→ Same as your last check-in',
          firstTime: 'This is your first Wheel of Life check-in',
        },
        wheelCaption: 'Slice width = time & energy invested. Color and depth = suffering level.',
        practiceHeading: 'Where to focus next',
        practiceIntro: 'This domain is asking for the most attention right now:',
        practices: {
          notNow: {
            title: 'Try: Not Now',
            description:
              'Notice the pull toward distraction or scrolling, and practice pausing for 60 seconds before reacting.',
          },
          breathing: {
            title: 'Try: Grounding Breath',
            description:
              'Place both hands on your body, take a few slow breaths, and let your system settle before moving on.',
          },
          headHeart: {
            title: 'Try: Head & Heart Check',
            description:
              'Pause and notice which is leading right now — your thinking mind or your feeling heart — without judging either.',
          },
        },
        finish: 'Return to Hub',
      },
    },
    steps: [
      {
        key: 'fire',
        icon: '🔥',
        title: 'Fire (action and pressure)',
        labelStart: 'Barely moved',
        labelEnd: "Couldn't stop for a moment",
        descriptions: {
          high: 'High fire: you did not stop for a moment. A lot of action, fast speech, jumping from task to task, maybe some irritation or restlessness.',
          low: "Low fire: it was hard to get started, procrastination was strong, and you had no desire to act.",
          mid: 'Balanced fire: calm, healthy action.',
        },
      },
      {
        key: 'water',
        icon: '💧',
        title: 'Water (emotion and containment)',
        labelStart: 'Rigid as rock',
        labelEnd: 'Overwhelmed and giving in',
        descriptions: {
          high: 'High water: you gave too much of yourself for others, listened and held space, or felt emotional flooding and sudden tears.',
          low: 'Low water: you were rigid, stubborn, impatient with others, and unwilling to listen.',
          mid: 'Balanced water: emotional flow and clean listening.',
        },
      },
      {
        key: 'air',
        icon: '☁️',
        title: 'Air (thought and dissociation)',
        labelStart: 'Totally unfocused',
        labelEnd: 'A storm of thoughts',
        descriptions: {
          high: 'High air: your mind was racing with too many thoughts. You read a lot, felt disconnected from your surroundings, and experienced inner conflict.',
          low: 'Low air: mental fog, trouble focusing, and impatience with long text.',
          mid: 'Balanced air: mental clarity and calm.',
        },
      },
      {
        key: 'earth',
        icon: '⛰️',
        title: 'Earth (body and comfort)',
        labelStart: 'Physical neglect',
        labelEnd: 'Strong need for comfort',
        descriptions: {
          high: 'High earth: you sought grounding through worry, food, and comfort. Your system wanted stability.',
          low: 'Low earth: you neglected your body, missed meals, or ignored what you wore.',
          mid: 'Balanced earth: healthy connection to bodily needs.',
        },
      },
    ],
    results: {
      fire: {
        highText: 'We detected excess fire. Action is important, but when it runs wild it burns and often covers an inner need for rest or connection.',
        highAction: 'Take 60 seconds now. Close your eyes, place both hands on your belly, and slow down.',
        lowText: 'We detected a lack of fire. Your inner flame is low and it is hard to initiate processes.',
        lowAction: 'Do 10 quick jumps in place or fast stretches to move blood and energy through your body.',
      },
      water: {
        highText: 'We detected soft boundaries (excess water). You were all about holding space and giving today, and when too much is poured out the container empties.',
        highAction: 'Say "no" to one request now, and do something small just for yourself.',
        lowText: 'We detected a lack of water. Your heart closed a little today and rigidity took over.',
        lowAction: 'Send a short kind message to someone you care about, with no agenda.',
      },
      air: {
        highText: 'We detected excess air. The head overworked mentally, with racing thoughts and disconnection from feeling.',
        highAction: 'Splash cold water on your face, or take deep diaphragmatic breaths for 30 seconds.',
        lowText: 'We detected a lack of air. There is a sense of mental fog or difficulty focusing.',
        lowAction: 'Open a window, take 3 deep breaths of fresh air, and read one paragraph of something meaningful.',
      },
      earth: {
        highText: 'We detected excess earth. The system is seeking grounding through worry or comfort eating.',
        highAction: 'Drink a glass of water slowly, and write down your main concern to get it out of your head.',
        lowText: 'We detected a lack of earth. You neglected basic physical needs today.',
        lowAction: 'Eat something nourishing and colorful now, or organize your clothes or nearby space.',
      },
    },
  },
  he: {
    appName: 'Centered',
    homeLabel: 'בית',
    progressLabel: 'התקדמות ארבעת היסודות',
    intro: {
      title: 'מה המצב האנרגטי שלך היום?',
      description: 'בכל יום אנו משתמשים באנרגיה דרך ארבעה ערוצים: עשייה (אש), רגש (מים), מחשבה (אוויר) וגוף (אדמה). בוא נבדוק מי מהם לקח ממך הכי הרבה אנרגיה היום, כדי שנוכל לאזן.',
    },
    buttons: {
      start: 'בוא נתחיל',
      next: 'הבא',
      calculate: 'חשב את המפה שלי',
      reset: 'בדיקה מחודשת',
    },
    dashboard: {
      title: 'מרכז תרגילים',
      subtitle: 'הפעל את תרגיל ארבעת היסודות או בדוק כלים שיגיעו בקרוב.',
      elements: {
        title: 'תרגיל ארבעת היסודות',
        description: 'מדוד את האנרגיה שלך באש, מים, אוויר ואדמה בליווי מדריך.',
      },
      notNow: {
        title: 'טיימר לא עכשיו',
        description: 'כאשר דחף פוגש אותך, עצור וממש אמור לעצמך "לא עכשיו" למשך 60 שניות.',
      },
      wheel: {
        title: 'גלגל החיים',
        description: 'מפה את איזון חייך על פני 8 תחומי חיים וראה היכן זורמת אנרגיה.',
      },
    },
    result: {
      heading: 'המפה האנרגטית שלך',
      diagnosisLabel: 'אבחון:',
      taskLabel: 'המשימה שלך לאמצע:',
      tokenAlert: '🎁 בצע/י את המשימה כדי לקבל אסימון נוכחות!',
    },
    languageSwitcher: {
      label: 'שפה',
      en: 'English',
      he: 'עברית',
    },
    notNow: {
      title: 'משקם נקודת האמצע',
      subtitle: 'כאשר דחף פוגש אותך, שב ישר. אל תילחם בו. פשוט אמור:',
      mantra: 'לא עכשיו',
      cancel: 'ביטול',
      breathIn: 'שאיפה...',
      breathOut: 'נשיפה...',
      stayCentred: 'נוכחות מלאה',
      success: 'הסערה חלפה! הרווחת +1 אסימון נוכחות',
      finish: 'חזרה ללוח הבקרה',
    },
    wheelOfLife: {
      intro: {
        title: 'גלגל החיים שלך',
        description:
          'זהו כלי למודעות, לא לשיפוטיות - אין דבר כזה גלגל מושלם. תדרג/י 8 תחומי חיים אחד אחרי השני, ובסוף תראה/י לאן האנרגיה שלך זורמת ולאן היא תקועה.',
        cta: 'בוא נתחיל',
      },
      progress: 'תחום {current}/{total}',
      domains: {
        work: 'קריירה ועבודה',
        family: 'משפחה והורות',
        partnership: 'זוגיות',
        body: 'גוף ובריאות',
        leisure: 'פנאי ותחביבים',
        externalWorld: 'העולם שבחוץ',
        finances: 'פיננסים',
        community: 'קהילה וחברים',
      },
      domainDescriptions: {
        work: 'איך הקריירה או דרישות העבודה משפיעות על האנרגיה והריכוז שלך?',
        family: 'כמה מאוזן/ת את/ה מרגיש/ה בתפקיד שלך כהורה או כבן/בת משפחה?',
        partnership: 'כמה מאוזן/ת את/ה מרגיש/ה בתוך הזוגיות שלך?',
        body: 'כמה מחובר ומטופל הגוף שלך מרגיש כרגע?',
        leisure: 'כמה מקום את/ה נותן/ת לעצמך למנוחה, למשחק ולתחביבים?',
        externalWorld:
          'כמה מהאנרגיה שלך נבלעת על ידי הסביבה שמסביבך? חשוב/י על הנסיעות היומיות, התנועה בדרכים, וההשפעה של חדשות ואירועים אקטואליים על השלווה הפנימית שלך.',
        finances: 'כמה הכסף והביטחון הכלכלי מעיבים על המחשבות שלך?',
        community: 'כמה את/ה מרגיש/ה נתמך/ת על ידי חברים והקהילה שלך?',
      },
      time: {
        title: 'השקעת זמן ואנרגיה',
        subtext: '1 = כמעט ולא משקיע/ה זמן או אנרגיה, 10 = צורך את רוב שעות הערות והאנרגיה שלי',
        lowLabel: 'כמעט לא',
        highLabel: 'תופס את כל היום',
      },
      suffering: {
        title: 'רמת סבל / מצוקה',
        subtext: '1 = אין סבל / שלווה פנימית, 10 = סבל מקסימלי / יגון',
        lowLabel: 'ללא סבל',
        highLabel: 'סבל מקסימלי',
      },
      back: 'הקודם',
      seeResults: 'ראה/י את התוצאות שלי',
      analysis: {
        heading: 'מדד האיזון שלך',
        tier: {
          low: 'יש כרגע קונפליקט פנימי ממשי שמרחיק אותך מהמרכז שלך. תרגול מקרקע יכול לעזור להחזיר אותך לאיזון.',
          moderate: 'יש לך מודעות למה שקורה, אבל אנרגיה דולפת איפשהו. המשיכ/י לשים לב לדפוסים שלך.',
          high: 'את/ה במקום יציב ומאוזן כרגע. המשיכ/י לתרגל את שמירת העין על המחול שבין הראש ללב.',
        },
        trend: {
          improved: '↑ טוב יותר מהבדיקה הקודמת שלך',
          declined: '↓ קצת נמוך יותר מהבדיקה הקודמת שלך',
          same: '→ זהה לבדיקה הקודמת שלך',
          firstTime: 'זאת בדיקת גלגל החיים הראשונה שלך',
        },
        wheelCaption: 'רוחב הפלח = זמן ואנרגיה שהושקעו. הצבע והעומק = רמת הסבל.',
        practiceHeading: 'לאן להפנות את המבט הבא',
        practiceIntro: 'התחום שמבקש כרגע הכי הרבה תשומת לב הוא:',
        practices: {
          notNow: {
            title: 'נסה/י: לא עכשיו',
            description: 'שימ/י לב למשיכה להסחת דעת או לגלילה, ותרגל/י לעצור ל-60 שניות לפני שמגיבים.',
          },
          breathing: {
            title: 'נסה/י: נשימת קרקוע',
            description: 'הנח/י שתי ידיים על הגוף, נשמ/י כמה נשימות איטיות, ותני למערכת שלך להירגע לפני שממשיכים.',
          },
          headHeart: {
            title: 'נסה/י: בדיקת ראש ולב',
            description: 'עצור/י ושימ/י לב מי מוביל כרגע - הראש החושב או הלב המרגיש - בלי לשפוט אף אחד מהם.',
          },
        },
        finish: 'חזרה ללוח הבקרה',
      },
    },
    steps: [
      {
        key: 'fire',
        icon: '🔥',
        title: 'יסוד האש (עשייה ולחץ)',
        labelStart: 'בקושי זזתי',
        labelEnd: 'לא עצרתי לרגע',
        descriptions: {
          high: 'אש גבוהה: לא נחת לרגע. המון עשייה, דיבור מהיר, ריצה ממשימה למשימה, אולי אפילו קצת כעס או עצבנות.',
          low: 'אש נמוכה: קושי לקום, דחיינות, חוסר חשק מוחלט לפעול.',
          mid: 'אש מאוזנת: עשייה רגועה ובריאה.',
        },
      },
      {
        key: 'water',
        icon: '💧',
        title: 'יסוד המים (הכלה ורגש)',
        labelStart: 'נוקשה כמו סלע',
        labelEnd: 'מוצף ומוותר לכולם',
        descriptions: {
          high: 'מים גבוהים: ויתרת על עצמך בשביל כולם, הקשבת והכלת אחרים, או שחווית הצפה רגשית ובכי פתאומי.',
          low: 'מים נמוכים: היית נוקשה, עקשן, נטול סבלנות לאחרים, לא הסכמת להקשיב.',
          mid: 'מים מאוזנים: זרימה רגשית והקשבה נקייה.',
        },
      },
      {
        key: 'air',
        icon: '☁️',
        title: 'יסוד האוויר (מחשבה וניתוק)',
        labelStart: 'חוסר ריכוז מוחלט',
        labelEnd: 'סערת מחשבות וניתוק',
        descriptions: {
          high: 'אוויר גבוה: המוח קדח ממחשבות. קראת המון, היית מנותק מהסביבה מול מסכים, חווית קונפליקט פנימי סוער.',
          low: 'אוויר נמוך: חוסר ריכוז, חוסר סבלנות לקרוא טקסט ארוך, בריחה לבידור קליל בלבד.',
          mid: 'אוויר מאוזן: בהירות מחשבתית ושקט.',
        },
      },
      {
        key: 'earth',
        icon: '⛰️',
        title: 'יסוד האדמה (גוף ונוחות)',
        labelStart: 'הזנחה גופנית',
        labelEnd: 'צורך אדיר באוכל ונוחות',
        descriptions: {
          high: 'אדמה גבוהה: חיפשת אוכל ונחמה, דאגת המון לאחרים ולעצמך, היית רגיש לריחות וחיפשת נוחות פיזית.',
          low: 'אדמה נמוכה: הזנחת את הגוף. שכחת לאכול מסודר או לא שמת לב מה לבשת.',
          mid: 'אדמה מאוזנת: חיבור בריא לצרכי הגוף.',
        },
      },
    ],
    results: {
      fire: {
        highText: 'זיהינו עודף אש. עשייה היא חשובה, אבל כשהיא יוצאת משליטה היא שורפת, ולרוב מחפה על צורך פנימי במגע או מנוחה.',
        highAction: 'קח עכשיו 60 שניות. עצום עיניים, שים שתי ידיים על הבטן, והורד הילוך.',
        lowText: 'זיהינו חוסר באש. הלהבה הפנימית שלך נמוכה, וקשה לך להניע תהליכים.',
        lowAction: 'עשה עכשיו 10 קפיצות במקום או מתיחות מהירות כדי להזרים דם ואינרציה לגוף.',
      },
      water: {
        highText: 'זיהינו חולשה של גבולות (עודף מים). היית כולך הכלה ונתינה היום, וכשמוזגים יותר מדי החוצה - הכלי מתרוקן.',
        highAction: 'תגיד עכשיו "לא" לדבר אחד שמבקשים ממך, ועשה משהו קטן רק עבור עצמך.',
        lowText: 'זיהינו חוסר במים. הלב שלך נסגר מעט היום, והנוקשות השתלטה.',
        lowAction: 'שלח/י הודעה קצרה ומפרגנת לאדם קרוב שאת/ה אוהב/ת, ללא אינטרס.',
      },
      air: {
        highText: 'זיהינו עודף אוויר. הראש פעל במשיכת יתר מנטלית, מחשבות טורדניות וניתוק מהחוויה הרגשית.',
        highAction: 'שטוף פנים במים קרים, או התמקד בנשימה סרעפתית עמוקה במשך חצי דקה.',
        lowText: 'זיהינו חוסר באוויר. ישנה תחושה של ערפול מנטלי או קושי להתמקד.',
        lowAction: 'פתח/י חלון, קח/י 3 נשימות עמוקות של אוויר נקי וקרא/י פסקה אחת מספר לימודי.',
      },
      earth: {
        highText: 'זיהינו עודף אדמה. המערכת מחפשת קרקוע דרך דאגנות יתר או חיפוש פיצוי באוכל ונוחות.',
        highAction: 'שתה כוס מים לאט, ורשום על דף את הדאגה המרכזית שלך כדי להוציא אותה מהראש.',
        lowText: 'זיהינו חוסר באדמה. הזנחת את הצרכים הפיזיים הבסיסיים שלך היום.',
        lowAction: 'אכל/י משהו מזין וצבעוני עכשיו, או סדר/י את הבגדים/הסביבה הקרובה שלך.',
      },
    },
  },
};
