exports.repo = "Hug3O/Scrolls2top"
exports.version = 1.3
exports.description = "Smart scroll to banner and top in idle/interaction loop"
exports.apiRequired = 1
exports.frontend_js = 'scrolltop.js'

exports.config = {
  scrollTopEnabled: {
    type: 'boolean',
    label: 'Enable auto scroll to top',
    defaultValue: true,
    frontend: true
  },
  smartScrollCycle: {
    type: 'boolean',
    label: 'Enable smart scroll loop (idle top / interaction to header)',
    defaultValue: true,
    frontend: true
  }
}
