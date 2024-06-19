const Progress = require("progress");

async function getData(numPosts, subName) {
  let lastPost = "";
  let posts = [];
  let bar = new Progress(":bar :current", { total: numPosts / 100 });

  for (let i = 0; i < numPosts / 100; i++) {
    let response = await fetch(
      "https://www.reddit.com/" +
        subName +
        "/top.json?t=all&show=all&limit=100&after=" +
        lastPost
    );
    if (!(response.status >= 200 && response.status <= 299)) {
      throw Error(response.statusText);
    }
    let data = await response.json();
    data = data["data"]["children"];
    for (let j = 0; j < 100; j++) {
      let post = data[j]["data"];
      let str =
        post["title"] +
        "\n\n" +
        post["selftext"] +
        "\n		-- u/" +
        post["author"] +
        ", " +
        post["ups"] +
        " upvotes, " +
        post["upvote_ratio"] +
        " ratio.";
      posts.push(str);
    }
    bar.tick();
    lastPost = data[99]["name"];
    await new Promise((r) => setTimeout(r, 6000));
  }
  await Bun.write("./" + subName, posts.sort().join("\n%\n"));
}

getData(20000, "r/youshouldknow");
getData(30000, "r/lifeprotips");
