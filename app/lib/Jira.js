const request = require('request');

const createJsonEntry = story => {
  const entry = {
    update: {},
    fields: {
      project: {
        key: story.key
      },
      summary: story.name,
      issuetype: {
        name: story.issueType
      }
    }
  };

  const description = parseDescription(story.criteria);

  entry.fields = Object.assign(entry.fields, {
    description,
    ...story.additionalFields
  });

  return entry;
};

const parseDescription = checklists => {
  let description = '';

  for (let i = 0, j = checklists.length; i < j; i += 1) {
    description += `{panel:title=${checklists[i].name}|borderStyle=solid|borderColor=#ccc|borderWidth=1px}\n`;
    for (let n = 0, m = checklists[i].checkItems.length; n < m; n += 1) {
      description += `* ${checklists[i].checkItems[n].name}\n`;
    }
    description += '{panel}\n';
  }

  return description;
};

const createTasksRequest = (payload, cb, overwriteDefault = {}) => {


  options = Object.assign(options, overwriteDefault);
  request(options, (error, res, body) => {
    console.log(res.statusCode);
    cb(JSON.parse(body));
  });
};

exports.fetchIssueFields = (url) => {
  const overwriteDefault = {
    url: `https://${url}/rest/api/2/issue/createmeta?projectKeys=TEST&expand=projects.issuetypes.fields`,
    method: 'GET'
  }

  createTasksRequest(null, data => {
    console.log(data);
  }, overwriteDefault);
}

/* This method is used to generate tasks for the start of a sprint */
exports.createTask = (boards, stories) => {
  const storyBoardLists = [];
  boards.map(board =>
    board.trelloLists.map(list =>
      storyBoardLists.push({ sprintName: board.boardName, listId: list.trelloId })
    )
  );

  const jiraPayload = {
    issueUpdates: []
  };

  const orderedStories = [];

  for (let list of storyBoardLists) {
    const storyEntry = stories[list.listId].map(story => {
      orderedStories.push(story);
      return createJsonEntry({
        name: story.name,
        criteria: story.checklists,
        issueType: 'Task',
        key: 'TEST',
        additionalFields: {}
          // customfield_10010: [list.sprintName]
        // }
      });
    });

    jiraPayload.issueUpdates = [...jiraPayload.issueUpdates, ...storyEntry];
  }

  createTasksRequest(jiraPayload, data => {
    // Callback to create subtasks from returned task keys
    if(data.errors && data.errors.length === 0) {
      for(let i = 0, j = data.issues.length; i < j; i++) {
        let jiraPayload = {
         issueUpdates: []
        }
        for(let label of orderedStories[i].labels) {
          label = label.name.toLowerCase();
          switch(label) {
            case 'qa':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `QA: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
                })];
              break;
            case 'ui':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({
                  name: `UI: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: 'Sub-task',
                  key: 'TEST',
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];
              break;
            case 'ux':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `UX: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];
              break;
            case 'js':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `JS: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];
              break;
            case 'api':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `API: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];
              break;
            case 'ta':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `TA: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];
              break;
            case 'unity':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({ 
                  name: `UNITY: ${orderedStories[i].name}`,
                  criteria: orderedStories[i].checklists,
                  issueType: "Sub-task",
                  key: "TEST",
                  additionalFields: {
                    parent: {
                      key: data.issues[i].key
                    }
                  }
              })];             
              break;
            default:
              break;
          }
        }
        if(jiraPayload.issueUpdates.length > 0) {
          createTasksRequest(jiraPayload, data => {console.log(data)});
        }
      }
    }
  });
}