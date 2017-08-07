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

const createTasksRequest = (payload, overwriteDefault = {}) => {
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

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      res.statusCode === 200 || res.statusCode === 201 ? resolve(JSON.parse(body)) : resolve({ error: body })
    });
  });
};

const splitStoryPoints = name => {
  const parsedName = name.match(/\(([^)]+)\) /);
  const storyPoints = parsedName[1];
  const splitName = name.split(parsedName[0])[1];
  return { name: splitName, storyPoints };
};

const makeSubtask = (story, data, requestOptions, form) => {
  let createdSubtasks = [];
  const jiraPayload = {
    issueUpdates: []
  };
  for (let label of story.labels) {
    label = label.name.toLowerCase();
    switch (label) {
      case 'qa':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `QA: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'ui':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `UI: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'ux':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `UX: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'js':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `JS: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'api':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `API: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'ta':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `TA: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      case 'unity':
        jiraPayload.issueUpdates = [...jiraPayload.issueUpdates,
          createJsonEntry({
            name: `UNITY: ${story.name}`,
            criteria: story.checklists,
            issueType: 'Sub-task',
            key: form.project,
            additionalFields: {
              parent: {
                key: data.key
              }
            }
          })];
        break;
      default:
        break;
    }
  }
  if (jiraPayload.issueUpdates.length > 0) {
    return createTasksRequest(jiraPayload, requestOptions);
  }
  return new Promise(reject => reject('This story needs no subtasks'));
};

exports.fetchIssueFields = (form, cb) => {
  const overwriteDefault = {
    url: `https://${form.domain}/rest/api/2/issue/createmeta?projectKeys=${form.project}`,
    method: 'GET',
    auth: {
      user: form.username,
      pass: form.password,
      sendImmediately: true
    }
  };

  const promise = createTasksRequest(null, overwriteDefault);
  promise.then((data) => {
    const availableFields = {
      subtasks: [],
      tasks: [],
    };
    for (let i = 0, j = data.projects[0].issuetypes.length; i < j; i += 1) {
      const index = data.projects[0].issuetypes[i];
      const { id, name, iconUrl } = index;
      Object.assign(availableFields,
        data.projects[0].issuetypes[i].subtask ?
        { subtasks: [...availableFields.subtasks, { id, name, iconUrl }] }
        : { tasks: [...availableFields.tasks, { id, name, iconUrl }] });
    }
    cb(availableFields);
  });
};

exports.fetchExtendedFields = (form, cb) => {
  const overwriteDefault = {
    url: `https://${form.domain}/rest/api/2/issue/createmeta?projectKeys=${form.project}&issueTypeIds=${form.issuetype}&expand=projects.issuetypes.fields`,
    method: 'GET',
    auth: {
      user: form.username,
      pass: form.password,
      sendImmediately: true
    }
  };

  const promise = createTasksRequest(null, overwriteDefault);
  promise.then((matchingIssueFields) => {
    const possibleMatches = matchingIssueFields.projects[0].issuetypes;
    const matchingField = {};
    for (let i = 0, j = possibleMatches.length; i < j; i += 1) {
      if (possibleMatches[i].name === form.issuetype) {
        matchingField[possibleMatches[i].id] = possibleMatches[i].fields;
      }
    }
    return cb(matchingField);
  });
};


/* This method is used to generate tasks for the start of a sprint */
exports.createTask = (boards, stories, form, cb) => {
  const requestOptions = {
    url: `https://${form.domain}/rest/api/2/issue/bulk`,
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
        // customfield_10034: 
        additionalFields: {}
          // customfield_10010: [list.sprintName]
        // }
      });
    });

    jiraPayload.issueUpdates = [...jiraPayload.issueUpdates, ...storyEntry];
  }
// There exists a stupid bug where if the last story converted has no subtasks... the callback wont fire
  createTasksRequest(jiraPayload, requestOptions).then(data => {
    const jiraIssueMap = {};
    for (let i = 0, j = orderedStories.length; i < j; i += 1) {
      jiraIssueMap[orderedStories[i].id] = data.issues[i];
    }
    const filteredLabeless = orderedStories.filter(story => story.labels.length > 0);
    if (data.errors && data.errors.length === 0) {
      const createdSubtasks = {};
      for (let i = 0, j = filteredLabeless.length; i < j; i += 1) {
        const createSubtask = makeSubtask(
          filteredLabeless[i],
          jiraIssueMap[filteredLabeless[i].id],
          requestOptions,
          form
        );
        createSubtask.then(value => {
          createdSubtasks[orderedStories[i].id] = value;
          if (i === j - 1) {
            cb({ success: true, subtasks: createdSubtasks, tasks: data.issues });
          }
        }).catch(e => { console.log(e); });
      }
    }
  });
};
