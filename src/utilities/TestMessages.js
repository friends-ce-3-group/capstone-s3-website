export function SeedMessages() {
  let seedMessages = [
    {
      "name": "Victor Lee",
      "value": "<p>hi David, It has been a great time working with you, thank you for all the prompt actions and business insights, see you again SS buddy! Victor Lee</p>",
      "wordCount": 28
    },
    {
      "name": "Kit",
      "value": "<p>Hi David, It was an honor to work with you and your committed Deskdev team. Thank you for the support and goodwill you've shown. Best wishes for the future. Kit</p>",
      "wordCount": 30
    },
    {
      "name": "Riki",
      "value": "<p>Hey David, It's been a wild 3yrs, coming in alongside the incumbent manager and having to manage what was no-doubt an awkward situation with \"one too many chefs in the kitchen\". Fast-forward a few months, you were the undisputed lead with 2020\"Dream Team\" delivering across the full stack. It was great having you in Hong Kong where the team had matured, hugely appreciated . On the personal front, my only regret is that COVID prevented a proper round of golf... Hope to meet you and have a proper farewell in 2022, assuming borders open. Best of luck in your new role and keep in touch!! Riki</p>",
      "wordCount": 106
    },
    {
      "name": "Chika",
      "value": "<p>David, I wish I know you better, but it was a great working with you on a few projects. Hope you enjoy your new role as well! Wish you the best. Thanks for your support to DeskDev team. Chika</p>",
      "wordCount": 39
    },
    {
      "name": "Wilson",
      "value": "<p>Hi David, Now, I have no one to ask on my silly IT issues.. good teamlead &amp; a good buddy.. wish you all the best on your new path.. Wilson</p>",
      "wordCount": 30
    },
    {
      "name": "Cecilia",
      "value": "<p>Hello David Thanks for all your great help in the past few years, good luck on everythinng and wish you all the very best in your new chapter! You will be missed! Cecilia</p>",
      "wordCount": 33
    },
    {
      "name": "Irene Fok",
      "value": "<p>Hi David, Good Luck and all the best with your new role! It's been great working with you... Stay in touch and let's catcup up again in HK or in T.O. Irene Fok</p>",
      "wordCount": 33
    },
    {
      "name": "Paul Stark",
      "value": "<p>Hi David, best of luck for your next challenge. It's not going to be same without you! Paul Stark</p>",
      "wordCount": 19
    }
  ];



  return seedMessages.sort(() => Math.random() - 0.5);
}

