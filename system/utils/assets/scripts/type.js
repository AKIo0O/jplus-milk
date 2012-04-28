/** * @author  */String.map("Array Date RegExp", function(nativeType){	window[nativeType].prototype.xtype = nativeType.toLowerCase();});

/**
 * ����һ�����������͵��ַ�����ʽ��
 * @param {Object} obj ������
 * @return {String} ���п��Է��ص��ַ����� string number boolean undefined null
 *         array function element class date regexp object��
 * @example <code> 
 * Object.type(null); // "null"
 * Object.type(); // "undefined"
 * Object.type(new Function); // "function"
 * Object.type(+'a'); // "number"
 * Object.type(/a/); // "regexp"
 * Object.type([]); // "array"
 * </code>
 */
Object.type = function(obj) {

		// ������� ��
	var typeName = typeof obj;

	return typeName === "object" ?
		obj === null ? 
					"null" :
					obj.xtype || (
						typeof obj.nodeType === "number" ? "node" : 
						typeName
					)
		: typeName;
}