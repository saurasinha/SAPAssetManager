interface ExtensionTableViewCellHandler extends NSObjectProtocol {
  getReuseIdentifier(): string;
  registerCellTo(tableView: UITableView);
  configureReusableCell(tableViewCell: UITableViewCell);
}
declare var ExtensionTableViewCellHandler: {
  prototype: ExtensionTableViewCellHandler;
};
