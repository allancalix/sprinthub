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

const createTasksRequest = (payload, overwriteDefault = {}, cb) => {
  let options = {
    url: 'https://sprinthub.atlassian.net/rest/api/2/issue/bulk',
    auth: {
      user: '',
      pass: '',
      sendImmediately: true
    },
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  };
  options = Object.assign(options, overwriteDefault);
  request(options, (error, res, body) => (
    res.statusCode === 200 ? cb(JSON.parse(body)) : cb({ error: body })
  ));
};

const splitStoryPoints = name => {
  const parsedName = name.match(/\(([^)]+)\) /);
  const storyPoints = parsedName[1];
  const splitName = name.split(parsedName[0])[1];
  return { name: splitName, storyPoints };
};

exports.fetchIssueFields = (form, cb) => {
  const overwriteDefault = {
    url: `https://${form.domain}/rest/api/2/issue/createmeta?projectKeys=${form.project}&expand=projects.issuetypes.fields`,
    method: 'GET',
    auth: {
      user: form.username,
      pass: form.password,
      sendImmediately: true
    }
  };

  createTasksRequest(null, overwriteDefault, (data) => {
    const availableFields = {
      subtasks: [],
      tasks: [],
      fieldsMap: {}
    };
    for (let i = 0, j = data.projects[0].issuetypes.length; i < j; i += 1) {
      const index = data.projects[0].issuetypes[i];
      const { id, name, iconUrl } = index;
      Object.assign(availableFields,
        data.projects[0].issuetypes[i].subtask ?
        { subtasks: [...availableFields.subtasks, { id, name, iconUrl }] }
        : { tasks: [...availableFields.tasks, { id, name, iconUrl }] });
      availableFields.fieldsMap[index.id] = index.fields;
    }
    cb(availableFields);
  });
};

/* This method is used to generate tasks for the start of a sprint */
exports.createTask = (boards, stories, form) => {
  const requestOptions = {
    url: 'https://sprinthub.atlassian.net/rest/api/2/issue/bulk',
    auth: {
      user: form.username,
      pass: form.password
    },
    method: 'POST'
  };

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
      const name = (story.name.search(/\(([^)]+)\) /) === 0)
        ? splitStoryPoints(story.name).name : story.name;
      return createJsonEntry({
        name,
        criteria: story.checklists,
        issueType: 'Task',
        key: form.project,
        additionalFields: {}
          // customfield_10010: [list.sprintName]
        // }
      });
    });

    jiraPayload.issueUpdates = [...jiraPayload.issueUpdates, ...storyEntry];
  }

  createTasksRequest(jiraPayload, requestOptions, data => {
    // Callback to create subtasks from returned task keys
    if (data.errors && data.errors.length === 0) {
      for (let i = 0, j = data.issues.length; i < j; i += 1) {
        let jiraPayload = {
         issueUpdates: []
        };
        for (let label of orderedStories[i].labels) {
          label = label.name.toLowerCase();
          switch (label) {
            case 'qa':
              jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
                createJsonEntry({
                  name: `QA: ${orderedStories[i].name}`,
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
                  issueType: 'Sub-task',
                  key: 'TEST',
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
                  issueType: 'Sub-task',
                  key: 'TEST',
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
                  issueType: 'Sub-task',
                  key: 'TEST',
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
                  issueType: 'Sub-task',
                  key: 'TEST',
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
                  issueType: 'Sub-task',
                  key: 'TEST',
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
        if (jiraPayload.issueUpdates.length > 0) {
          createTasksRequest(jiraPayload, data => { console.log(data) });
        }
      }
    }
  });
};
