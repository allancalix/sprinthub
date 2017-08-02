'use strict';
const request = require('request');

const createJsonEntry = story => {
  let entry = {
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
  }

  const description = parseDescription(story.criteria);

  entry.fields = Object.assign(entry.fields, {
    description: description,
    ...story.additionalFields
  });

  return entry;
}

const parseDescription = checklists => {
  let description = '';

  for(let checklist of checklists) {
    description += `{panel:title=${checklist.name}|borderStyle=solid|borderColor=#ccc|borderWidth=1px}\n`;
    for(let criteria of checklist.checkItems) {
      description += `* ${criteria.name}\n`;
    }
    description += '{panel}\n';
  }

  return description;
}

const createTasksRequest = (payload, cb) => {
  //const options

  request(options, (error, res, body) => {
    console.log(res.statusCode);
    cb(JSON.parse(body));
  });
}

/* This method is used to generate tasks for the start of a sprint */
exports.createTask =  (boards, stories) => {
  let storyBoardLists = []
  boards.map(board => {
    board.trelloLists.map(list => {
      storyBoardLists.push(list.trelloId);
    });
  });

  let jiraPayload = {
    issueUpdates: []
  }

  let orderedStories = []

  for(let list of storyBoardLists) {
    let storyEntry = stories[list].map(story => {
      orderedStories.push(story);
      return createJsonEntry({
        name: story.name,
        criteria: story.checklists,
        issueType: "Task",
        key: "TEST",
        additionalFields: {}
      });
    });

    jiraPayload.issueUpdates = [...jiraPayload.issueUpdates, ...storyEntry];
  }

  createTasksRequest(jiraPayload, data => {
    // Callback to create subtasks from returned task keys
    for(let i = 0, j = data.issues.length; i < j; i++) {
      if(data.errors && data.errors.length === 0) {
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
                  issueType: "Sub-task",
                  key: "TEST",
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